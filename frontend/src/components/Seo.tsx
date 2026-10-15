import React, { useEffect } from 'react';

const DEFAULT_TITLE = 'K.S. Steel Corporation | Quality Building Materials in Pasupathi Kovil';
const DEFAULT_DESCRIPTION = 'K.S. Steel Corporation - Premier supplier of TMT steel rebars, UltraTech cement, MS pipes, paints, power tools, roofing sheets, motor pumps, and building materials in Pasupathi Kovil, Tamil Nadu.';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(key: string, content: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function absoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return window.location.origin;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  return `${window.location.origin}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  jsonLd
}) => {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = image ? absoluteUrl(image) : '';

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', 'index,follow');
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', type, 'property');
    upsertMeta('og:url', canonicalUrl, 'property');
    upsertMeta('og:site_name', 'K.S. Steel Corporation', 'property');
    upsertMeta('twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);

    if (imageUrl) {
      upsertMeta('og:image', imageUrl, 'property');
      upsertMeta('twitter:image', imageUrl);
    }
    if (publishedTime) upsertMeta('article:published_time', publishedTime, 'property');
    if (modifiedTime) upsertMeta('article:modified_time', modifiedTime, 'property');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const scriptId = 'ks-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLdKey) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = jsonLdKey;
    } else if (script) {
      script.remove();
    }

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta('description', DEFAULT_DESCRIPTION);
      upsertMeta('og:title', DEFAULT_TITLE, 'property');
      upsertMeta('og:description', DEFAULT_DESCRIPTION, 'property');
      upsertMeta('og:type', 'website', 'property');
      upsertMeta('og:url', window.location.origin, 'property');
      document.getElementById(scriptId)?.remove();
    };
  }, [title, description, path, image, type, publishedTime, modifiedTime, jsonLdKey]);

  return null;
};
