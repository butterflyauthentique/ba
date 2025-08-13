'use client';

import { Share2, Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SiFacebook, SiX, SiWhatsapp } from 'react-icons/si';

type Props = {
  url: string; // relative like /blog/slug or absolute
  title?: string;
  text?: string;
  className?: string;
};

export default function ShareButton({ url, title, text, className }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleShare = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const fullUrl = url.startsWith('http') ? url : `${origin}${url}`;
      const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
      if (isMobile && navigator.share) {
        // Fire-and-forget to avoid blocking UI while native sheet is open
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigator.share({ url: fullUrl, title, text }).catch((err) => {
          console.warn('Share failed:', err);
        });
        return;
      }
      // On desktop: open lightweight share menu instead of invoking native share
      setOpen((prev) => !prev);
    } catch (err) {
      console.warn('Share failed:', err);
    }
  }, [url, title, text]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const target = ev.target as Node;
      if (!containerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true } as any);
  }, [open]);

  const copyToClipboard = useCallback(async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const fullUrl = url.startsWith('http') ? url : `${origin}${url}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }, [url]);

  const encodedUrl = typeof window !== 'undefined' ? encodeURIComponent(url.startsWith('http') ? url : `${window.location.origin}${url}`) : '';
  const encodedTitle = encodeURIComponent(title || '');
  const encodedText = encodeURIComponent(text || '');

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share"
        className={
          className ||
          'inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white transition-all hover:bg-gray-50 hover:shadow-sm hover:border-gray-300 active:scale-95'
        }
      >
        <Share2 className="w-4 h-4" />
        <span className="sr-only">Share</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border bg-white shadow-md z-10 p-2">
          <button onClick={copyToClipboard} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm">
            <Copy className="w-4 h-4" /> Copy link
          </button>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm">
            <SiFacebook className="w-4 h-4 text-[#1877F2]" /> Facebook
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle || encodedText}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm">
            <SiX className="w-4 h-4" /> X (Twitter)
          </a>
          <a href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noopener" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm">
            <SiWhatsapp className="w-4 h-4 text-[#25D366]" /> WhatsApp
          </a>
        </div>
      )}
      {copied && (
        <span
          role="status"
          aria-live="polite"
          className="absolute -right-2 -top-2 translate-x-full select-none text-xs bg-black text-white rounded px-2 py-1 flex items-center gap-1"
        >
          <Check className="w-3 h-3" /> Copied
        </span>
      )}
    </div>
  );
}


