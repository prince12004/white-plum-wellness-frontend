/** Shared helpers for the admin forms' "one item per line" textarea fields —
 * used for every string[] field (symptoms, benefits, terms, bio bullet points, etc.)
 * so we don't need a dynamic add/remove-row UI for plain string lists. */
export function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToLines(arr: string[] | undefined | null): string {
  return (arr ?? []).join('\n');
}
