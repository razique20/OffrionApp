/**
 * Dependency-free QR code generator (byte mode, error-correction level M).
 *
 * We avoid pulling in an npm QR library: the only thing we ever encode is a
 * short Offrion redeem code (e.g. "OFFRION-AB12CD"), which fits comfortably in
 * a low-version symbol. The code is generated in the browser on demand and is
 * never persisted — it's purely a render of the claim's existing redeemCode so
 * a merchant can scan instead of typing.
 *
 * Returns a boolean matrix (true = dark module). Callers render it however they
 * like (we draw an SVG). Implementation follows the QR spec (ISO/IEC 18004):
 * Reed-Solomon over GF(256), the standard mask patterns, and format/version
 * information. Kept intentionally compact and limited to versions 1–10, which
 * is far more than enough for our payloads.
 */

// --- Galois field GF(256) tables (primitive polynomial 0x11d) ---
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

const gfMul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

/** Reed-Solomon generator polynomial of the given degree. */
function rsGenerator(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

/** Compute `ecLen` error-correction codewords for a data block. */
function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGenerator(ecLen);
  const res = new Array(ecLen).fill(0);
  for (const d of data) {
    const factor = d ^ res[0];
    res.shift();
    res.push(0);
    // gen[0] is the leading 1 (already consumed by `factor`); the remaining
    // coefficients gen[1..ecLen] feed back into the register.
    for (let j = 0; j < ecLen; j++) res[j] ^= gfMul(gen[j + 1], factor);
  }
  return res;
}

// --- Capacity / EC parameters for level M, versions 1–6 ---
// [totalCodewords, ecCodewordsPerBlock, numBlocksGroup1, dataCwGroup1,
//  numBlocksGroup2, dataCwGroup2]
const EC_M: Record<number, [number, number, number, number, number, number]> = {
  1: [26, 10, 1, 16, 0, 0],
  2: [44, 16, 1, 28, 0, 0],
  3: [70, 26, 1, 44, 0, 0],
  4: [100, 18, 2, 32, 0, 0],
  5: [134, 24, 2, 43, 0, 0],
  6: [172, 16, 4, 27, 0, 0],
};

// A single centre alignment pattern from v2; v1 has none.
const ALIGN_POS: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
};

function dataCapacityBytes(version: number): number {
  const [, ec, b1, d1, b2, d2] = EC_M[version];
  void ec;
  return b1 * d1 + b2 * d2;
}

/** Build the bit stream for byte mode and pad it to the version capacity. */
function buildDataCodewords(bytes: number[], version: number): number[] {
  const bits: number[] = [];
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  push(0b0100, 4); // byte mode indicator
  push(bytes.length, 8); // char-count is 8 bits for versions 1–9
  for (const b of bytes) push(b, 8);

  const capacityBits = dataCapacityBytes(version) * 8;
  // Terminator (up to 4 zero bits), then pad to a byte boundary.
  for (let i = 0; i < 4 && bits.length < capacityBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let cw = 0;
    for (let j = 0; j < 8; j++) cw = (cw << 1) | bits[i + j];
    codewords.push(cw);
  }
  // Pad codewords alternate between 0xEC and 0x11.
  const pads = [0xec, 0x11];
  let p = 0;
  while (codewords.length < dataCapacityBytes(version)) codewords.push(pads[p++ & 1]);
  return codewords;
}

/** Interleave data + EC codewords across blocks per the spec. */
function buildFinalSequence(dataCodewords: number[], version: number): number[] {
  const [, ecLen, b1, d1, b2, d2] = EC_M[version];
  const blocks: { data: number[]; ec: number[] }[] = [];
  let offset = 0;
  for (let i = 0; i < b1; i++) {
    const data = dataCodewords.slice(offset, offset + d1);
    offset += d1;
    blocks.push({ data, ec: rsEncode(data, ecLen) });
  }
  for (let i = 0; i < b2; i++) {
    const data = dataCodewords.slice(offset, offset + d2);
    offset += d2;
    blocks.push({ data, ec: rsEncode(data, ecLen) });
  }

  const result: number[] = [];
  const maxData = Math.max(d1, d2);
  for (let i = 0; i < maxData; i++) {
    for (const blk of blocks) if (i < blk.data.length) result.push(blk.data[i]);
  }
  for (let i = 0; i < ecLen; i++) {
    for (const blk of blocks) result.push(blk.ec[i]);
  }
  return result;
}

type Matrix = (boolean | null)[][];

function setupFunctionPatterns(size: number, version: number): { matrix: Matrix; reserved: boolean[][] } {
  const matrix: Matrix = Array.from({ length: size }, () => new Array(size).fill(null));
  const reserved: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  const place = (r: number, c: number, v: boolean) => {
    matrix[r][c] = v;
    reserved[r][c] = true;
  };

  // Finder patterns + separators at the three corners.
  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inRing =
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        place(rr, cc, inRing);
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);

  // Timing patterns.
  for (let i = 8; i < size - 8; i++) {
    place(6, i, i % 2 === 0);
    place(i, 6, i % 2 === 0);
  }

  // Alignment patterns. Their centres can sit on the timing line, so we can't
  // skip on `reserved`; instead we skip the three positions whose 5×5 box would
  // collide with a finder pattern (the spec omits exactly those).
  const positions = ALIGN_POS[version];
  const overlapsFinder = (r: number, c: number) =>
    (r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8);
  for (const r of positions) {
    for (const c of positions) {
      if (overlapsFinder(r, c)) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const ring = Math.max(Math.abs(dr), Math.abs(dc));
          place(r + dr, c + dc, ring !== 1);
        }
      }
    }
  }

  // Dark module.
  place(size - 8, 8, true);

  // Reserve format-info areas (filled later).
  for (let i = 0; i < 9; i++) {
    if (!reserved[8][i]) reserved[8][i] = true;
    if (!reserved[i][8]) reserved[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }

  return { matrix, reserved };
}

function placeData(matrix: Matrix, reserved: boolean[][], bytes: number[], size: number) {
  const bits: number[] = [];
  for (const b of bytes) for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);

  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // skip the vertical timing column
    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i;
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        if (reserved[row][cc]) continue;
        matrix[row][cc] = bitIdx < bits.length ? bits[bitIdx] === 1 : false;
        bitIdx++;
      }
    }
    upward = !upward;
  }
}

const MASKS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

/** Penalty score used to pick the best mask (lower is better). */
function penalty(m: boolean[][], size: number): number {
  let score = 0;
  // Rule 1: runs of 5+ same-colour modules in rows/cols.
  for (let r = 0; r < size; r++) {
    for (let dir = 0; dir < 2; dir++) {
      let run = 1;
      let prev = dir === 0 ? m[r][0] : m[0][r];
      for (let i = 1; i < size; i++) {
        const cur = dir === 0 ? m[r][i] : m[i][r];
        if (cur === prev) {
          run++;
          if (run === 5) score += 3;
          else if (run > 5) score += 1;
        } else {
          run = 1;
          prev = cur;
        }
      }
    }
  }
  // Rule 2: 2x2 blocks of same colour.
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
    }
  }
  // Rule 4: proportion of dark modules.
  let dark = 0;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (m[r][c]) dark++;
  const ratio = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(ratio - 50) / 5) * 10;
  return score;
}

// Format info for EC level M with BCH error correction, indexed by mask.
const FORMAT_M = [
  0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
];

function applyMaskAndFormat(matrix: Matrix, reserved: boolean[][], size: number, mask: number): boolean[][] {
  const out: boolean[][] = matrix.map((row) => row.map((v) => v === true));
  const maskFn = MASKS[mask];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && maskFn(r, c)) out[r][c] = !out[r][c];
    }
  }

  // Place the 15-bit format information in its two standard copies. Per the
  // spec the bits are laid out most-significant first (bit 14 lands nearest the
  // top-left finder), so we read the BCH string from bit 14 down to bit 0.
  const fmt = FORMAT_M[mask];
  const bit = (i: number) => ((fmt >> i) & 1) === 1;

  // Copy 1 (around the top-left finder): bits 14–9 along row 8 (cols 0–5), then
  // the corner (bit8 at col7, bit7 at col8, bit6 at row7), then bits 5–0 up col 8.
  for (let i = 0; i <= 5; i++) out[8][i] = bit(14 - i);
  out[8][7] = bit(8);
  out[8][8] = bit(7);
  out[7][8] = bit(6);
  for (let i = 0; i <= 5; i++) out[i][8] = bit(i);

  // Copy 2: bits 14–8 up col 8 from the bottom (7 bits), then bits 7–0 along
  // row 8 from col size-8 to the right edge (8 bits). The dark module at
  // (size-8, 8) is NOT a format bit and must stay set.
  for (let i = 0; i <= 6; i++) out[size - 1 - i][8] = bit(14 - i);
  for (let i = 0; i <= 7; i++) out[8][size - 8 + i] = bit(7 - i);

  return out;
}

// We only emit versions 1–6 (single error-correction block, single alignment
// pattern). That's a ~80-byte byte-mode payload at level M — vastly more than a
// redeem code ("OFFRION-AB12CD" is a version-1 symbol) ever needs. The
// multi-block / multi-alignment layout of v7+ is intentionally out of scope.
const MAX_VERSION = 6;

/**
 * Generate a QR matrix (level M) for the given text. Returns a square boolean
 * grid; `true` means a dark module. Throws if the text exceeds the v6 capacity.
 */
export function generateQR(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));

  let version = 0;
  for (let v = 1; v <= MAX_VERSION; v++) {
    // Need room for mode (4) + char count (8 bits at these versions), in bytes.
    const headerBytes = Math.ceil((4 + 8) / 8);
    if (dataCapacityBytes(v) >= bytes.length + headerBytes) {
      version = v;
      break;
    }
  }
  if (version === 0) throw new Error('QR payload too large');

  const dataCodewords = buildDataCodewords(bytes, version);
  const finalSequence = buildFinalSequence(dataCodewords, version);

  const size = version * 4 + 17;
  const { matrix, reserved } = setupFunctionPatterns(size, version);
  placeData(matrix, reserved, finalSequence, size);

  let best: boolean[][] | null = null;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const candidate = applyMaskAndFormat(matrix, reserved, size, mask);
    const score = penalty(candidate, size);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best!;
}

/** Render a QR matrix as an SVG string (dark modules on a light background). */
export function qrToSvg(matrix: boolean[][], opts?: { margin?: number }): string {
  const margin = opts?.margin ?? 4;
  const size = matrix.length;
  const dim = size + margin * 2;
  let path = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) path += `M${c + margin} ${r + margin}h1v1h-1z`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges">` +
    `<rect width="${dim}" height="${dim}" fill="#ffffff"/>` +
    `<path d="${path}" fill="#000000"/>` +
    `</svg>`
  );
}
