/** Admin-entered links render as real hrefs, so anything but a known-safe scheme (e.g. javascript:) is dropped. */
export function safeHref(href: string): string {
  const value = href.trim();
  return /^(\/|#|https?:\/\/|tel:|mailto:)/i.test(value) ? value : '#';
}
