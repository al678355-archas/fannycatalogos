import { useEffect } from 'react';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content || '');
}

/** SEO básico en cliente por página: title, description y Open Graph */
export function useDocumentMeta({ title, description, image, url }) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url || window.location.href);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
  }, [title, description, image, url]);
}

/** Favicon configurable desde el CMS */
export function useFavicon(href) {
  useEffect(() => {
    if (!href) return;
    const link = document.getElementById('app-favicon');
    if (link) link.setAttribute('href', href);
  }, [href]);
}
