'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Share2, Instagram, Mail, Copy, Check } from 'lucide-react';
import { SiFacebook, SiX, SiWhatsapp } from 'react-icons/si';

type Props = {
  url: string;
  title?: string;
  description?: string;
  buttonClassName?: string;
};

export default function ShareMenu({ url, title, description, buttonClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fullUrl = useMemo(() => {
    if (typeof window === 'undefined') return url;
    return url.startsWith('http') ? url : `${window.location.origin}${url}`;
  }, [url]);

  const text = description || title || '';

  const links = useMemo(() => ({
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(fullUrl)}`,
    email: (() => {
      const subject = `Check this out`;
      const body = `${title ? title + '\n\n' : ''}${text ? text + '\n\n' : ''}${fullUrl}`;
      return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    })(),
  }), [fullUrl, text, title]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick, { capture: true });
    return () => document.removeEventListener('click', onDocClick, { capture: true } as any);
  }, [open]);

  const onToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(v => !v);
  }, []);

  const onCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [fullUrl]);

  const openNew = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(href, '_blank', 'noopener');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Share"
        className={
          buttonClassName ||
          'inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white border rounded-full shadow-md transition-all hover:bg-gray-50 hover:shadow-lg'
        }
      >
        <Share2 className="w-4 h-4 text-gray-700" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
          <div className="space-y-1">
            <button onClick={onCopy} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm text-left">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-700" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button onClick={openNew(links.facebook)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm text-left">
              <SiFacebook className="w-4 h-4 text-[#1877F2]" /> Facebook
            </button>
            <button onClick={openNew(links.x)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm text-left">
              <SiX className="w-4 h-4" /> X (Twitter)
            </button>
            <button onClick={openNew(links.whatsapp)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm text-left">
              <SiWhatsapp className="w-4 h-4 text-[#25D366]" /> WhatsApp
            </button>
            <button onClick={onCopy} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm text-left">
              <Instagram className="w-4 h-4 text-pink-600" /> Instagram
            </button>
            <a href={links.email} onClick={(e) => { e.stopPropagation(); }} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-sm">
              <Mail className="w-4 h-4 text-gray-700" /> Email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}


