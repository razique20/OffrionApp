'use client';

import React, { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { generateQR, qrToSvg } from '@/lib/qrcode';
import { displayRedeemCode } from '@/lib/redeemCode';

/**
 * Shows a claim's redeem code as a QR. The QR is generated in the browser from
 * the code on each open — nothing is fetched or persisted, it's purely a render
 * of the code the customer already holds. A merchant scans it (or reads the
 * code below it) to redeem; `normalizeRedeemCode` on the server tolerates the
 * branded "OFFRION-" prefix we encode here.
 */
export default function QrCodeModal({
  code,
  title,
  onClose,
}: {
  code: string;
  title?: string;
  onClose: () => void;
}) {
  // Encode the branded form so a generic scanner surfaces a recognisable code.
  const branded = displayRedeemCode(code);
  const svg = useMemo(() => qrToSvg(generateQR(branded)), [branded]);

  // Close on Escape, and lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Redeem code QR"
    >
      <div
        className="relative w-full max-w-xs bg-card border border-border rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <p className="text-sm font-bold tracking-tight text-center pr-6 mb-1 truncate">{title}</p>
        )}
        <p className="text-[11px] text-muted-foreground text-center mb-5">Show this to the merchant to redeem</p>

        <div className="bg-white rounded-2xl p-4 mx-auto w-fit">
          {/* QR is rendered client-side from the code; inline SVG, never stored. */}
          <div
            className="w-48 h-48 [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>

        <p className="text-center mt-5 font-mono font-bold tracking-[0.2em] text-lg">{branded}</p>
      </div>
    </div>
  );
}
