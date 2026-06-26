'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** A dark, copyable code block. */
export function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-800 group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{language}</span>
        <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors" aria-label="Copy">
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}

export type Param = { name: string; type: string; required?: boolean; desc: string };
export type Field = { name: string; desc: string };

const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-500',
  POST: 'bg-blue-500/15 text-blue-500',
  PUT: 'bg-amber-500/15 text-amber-500',
  PATCH: 'bg-violet-500/15 text-violet-500',
  DELETE: 'bg-red-500/15 text-red-500',
};

/**
 * A single API endpoint rendered with one consistent structure so partners
 * never get confused: header (method + path), description, then numbered
 * Request and Response blocks (params/payload + example + field notes).
 */
export function Endpoint({
  method,
  path,
  description,
  params,
  requestBody,
  responseExample,
  responseFields,
  curl,
  note,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description?: string;
  params?: Param[];
  requestBody?: string;
  responseExample: string;
  responseFields?: Field[];
  curl?: string;
  note?: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-secondary/30">
        <span className={cn('px-2.5 py-1 rounded-md text-[11px] font-black font-mono tracking-wide', METHOD_STYLES[method])}>
          {method}
        </span>
        <code className="text-sm font-bold font-mono text-foreground break-all">{path}</code>
      </div>

      <div className="p-6 space-y-7">
        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}

        {/* Request */}
        {(params?.length || requestBody) && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-3">Request</p>
            {params && params.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden mb-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-border">
                      <th className="px-4 py-3">Parameter</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {params.map((p) => (
                      <tr key={p.name} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-foreground whitespace-nowrap">
                          {p.name}
                          {p.required && <span className="ml-1.5 text-[9px] font-bold text-red-500 uppercase">req</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{p.type}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {requestBody && <CodeBlock language="json" code={requestBody} />}
          </div>
        )}

        {/* Response */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-3">Response · 200 OK</p>
          <CodeBlock language="json" code={responseExample} />
          {responseFields && responseFields.length > 0 && (
            <ul className="text-[11px] space-y-1.5 text-muted-foreground mt-3">
              {responseFields.map((f) => (
                <li key={f.name}>
                  <code className="text-foreground font-mono">{f.name}</code> — {f.desc}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* cURL */}
        {curl && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-3">Example (cURL)</p>
            <CodeBlock language="bash" code={curl} />
          </div>
        )}

        {note && (
          <div className="text-xs text-muted-foreground bg-secondary/40 border border-border rounded-lg p-3 leading-relaxed">
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
