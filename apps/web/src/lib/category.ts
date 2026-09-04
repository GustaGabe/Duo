import type { CategoryColor } from '@duo/shared';

/** Colour options offered by the category form, in the order the design shows them. */
export const CATEGORY_COLORS: CategoryColor[] = ['accent', 'ink', 'mist', 'violet', 'silver'];

/** Badge suggestions offered while creating a category. */
export const TAG_SUGGESTIONS = ['PT', 'ED', 'AS', 'GI', 'PC', 'PS'];

/** Builds a two-letter badge out of a category name: "Mercado" -> "ME". */
export function suggestTag(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '??';
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return `${words[0]![0]}${words[1]![0]}`.toUpperCase();
}
