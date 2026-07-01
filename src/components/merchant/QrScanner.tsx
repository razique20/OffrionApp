'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, CameraOff, Loader2, ScanLine } from 'lucide-react';
import { normalizeRedeemCode } from '@/lib/redeemCode';

// Minimal typings for the browser-native BarcodeDetector API (not yet in the
// standard TS DOM lib). We only use QR detection.
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorInstance {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}
interface BarcodeDetectorCtor {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
  getSupportedFormats?(): Promise<string[]>;
}

/**
 * Live camera QR scanner for the merchant redemption terminal. Reads the QR a
 * customer shows from their account, extracts the redeem code, and hands the
 * normalized 6-char code back to the caller (which runs the usual redeem flow).
 *
 * Decoding uses the browser-native BarcodeDetector API (Chromium, Android,
 * Safari 17+). Where it's unavailable we surface a clear message and let the
 * merchant fall back to manual entry — we don't bundle a heavy decode library.
 */
export default function QrScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  // Guard so we only ever fire onDetected once per scanner session.
  const doneRef = useRef(false);
  const [status, setStatus] = useState<'starting' | 'scanning' | 'unsupported' | 'denied' | 'error'>('starting');

  useEffect(() => {
    let cancelled = false;

    const stop = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };

    const run = async () => {
      const DetectorCtor = (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
      if (!DetectorCtor) {
        setStatus('unsupported');
        return;
      }

      let detector: BarcodeDetectorInstance;
      try {
        const formats: string[] = (await DetectorCtor.getSupportedFormats?.()) || [];
        if (formats.length && !formats.includes('qr_code')) {
          setStatus('unsupported');
          return;
        }
        detector = new DetectorCtor({ formats: ['qr_code'] });
      } catch {
        setStatus('unsupported');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        setStatus('scanning');

        const tick = async () => {
          if (cancelled || doneRef.current) return;
          try {
            const codes = await detector.detect(video);
            for (const c of codes) {
              const normalized = normalizeRedeemCode(c.rawValue || '');
              // Our redeem codes are 6-char alphanumeric; ignore anything else
              // so a stray QR in frame doesn't trigger a bogus redeem.
              if (normalized.length === 6) {
                doneRef.current = true;
                onDetected(normalized);
                return;
              }
            }
          } catch {
            // Transient per-frame detect errors are non-fatal; keep scanning.
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : '';
        setStatus(name === 'NotAllowedError' ? 'denied' : 'error');
      }
    };

    run();
    return () => {
      cancelled = true;
      stop();
    };
  }, [onDetected]);

  const messages: Record<string, { title: string; body: string }> = {
    unsupported: {
      title: 'Camera scanning not supported',
      body: 'This browser can’t scan QR codes. Please enter the code manually below.',
    },
    denied: {
      title: 'Camera access blocked',
      body: 'Allow camera access in your browser settings, or enter the code manually below.',
    },
    error: {
      title: 'Could not start the camera',
      body: 'Something went wrong opening the camera. Please enter the code manually below.',
    },
  };
  const fallback = messages[status];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Scan QR code"
    >
      <div
        className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <ScanLine className="w-4 h-4 text-foreground" />
          <p className="text-sm font-bold tracking-tight">Scan customer QR</p>
          <button
            onClick={onClose}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {fallback ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <CameraOff className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-bold">{fallback.title}</p>
            <p className="text-sm text-muted-foreground">{fallback.body}</p>
          </div>
        ) : (
          <div className="relative aspect-square bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2/3 aspect-square border-2 border-white/80 rounded-2xl" />
            </div>
            {status === 'starting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <p className="text-xs text-white/80 font-semibold">Starting camera…</p>
              </div>
            )}
            {status === 'scanning' && (
              <p className="absolute bottom-4 inset-x-0 text-center text-xs text-white/90 font-semibold">
                Point at the customer&apos;s QR code
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
