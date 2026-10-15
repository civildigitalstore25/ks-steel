import React from 'react';

const ALLOWED = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'H2', 'H3', 'UL', 'OL', 'LI', 'A', 'BLOCKQUOTE', 'IMG', 'IFRAME', 'SPAN', 'CODE', 'DIV']);

function safeStyle(element: HTMLElement): string {
  const style = element.getAttribute('style') || '';
  const parts: string[] = [];
  const align = style.match(/text-align:\s*(left|center|right|justify)/i);
  const color = style.match(/(?:^|;)\s*color:\s*(#[0-9a-fA-F]{3,8})/i);
  if (align && ['P', 'H2', 'H3'].includes(element.tagName)) parts.push(`text-align: ${align[1].toLowerCase()}`);
  if (color && element.tagName === 'SPAN') parts.push(`color: ${color[1]}`);
  return parts.join('; ');
}

function sanitizeNode(node: Node, doc: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) return doc.createTextNode(node.textContent || '');
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as HTMLElement;
  const children = Array.from(element.childNodes)
    .map((child) => sanitizeNode(child, doc))
    .filter((child): child is Node => child !== null);

  if (element.tagName === 'DIV' && !element.hasAttribute('data-youtube-video')) {
    const fragment = doc.createDocumentFragment();
    children.forEach((child) => fragment.appendChild(child));
    return fragment;
  }

  if (!ALLOWED.has(element.tagName)) {
    const fragment = doc.createDocumentFragment();
    children.forEach((child) => fragment.appendChild(child));
    return fragment;
  }

  const clean = doc.createElement(element.tagName.toLowerCase());
  const style = safeStyle(element);
  if (style) clean.setAttribute('style', style);

  if (element.tagName === 'A') {
    const href = element.getAttribute('href') || '';
    if (/^(https?:\/\/|mailto:|tel:|\/)/.test(href)) {
      clean.setAttribute('href', href);
      if (href.startsWith('http')) {
        clean.setAttribute('target', '_blank');
        clean.setAttribute('rel', 'noopener noreferrer');
      }
    }
  }

  if (element.tagName === 'IMG') {
    const src = element.getAttribute('src') || '';
    if (!/^(https?:\/\/|\/)/.test(src)) return null;
    clean.setAttribute('src', src);
    clean.setAttribute('alt', element.getAttribute('alt') || '');
    return clean;
  }

  if (element.tagName === 'IFRAME') {
    const src = element.getAttribute('src') || '';
    if (!/^https:\/\/(www\.)?youtube(?:-nocookie)?\.com\/embed\/[\w-]{6,}/.test(src)) return null;
    clean.setAttribute('src', src.split('?')[0]);
    clean.setAttribute('allowfullscreen', 'true');
    clean.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    return clean;
  }

  if (element.tagName === 'DIV') clean.setAttribute('data-youtube-video', '');
  children.forEach((child) => clean.appendChild(child));
  return clean;
}

export function sanitizeRichText(html: string): string {
  if (!html || typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const clean = sanitizeNode(doc.body, doc);
  const holder = doc.createElement('div');
  if (clean) holder.appendChild(clean);
  return holder.innerHTML;
}

export function plainTextFromHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export const RichText: React.FC<{ html: string; className?: string }> = ({ html, className = '' }) => {
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return <p className={className}>{html}</p>;
  }
  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
    />
  );
};
