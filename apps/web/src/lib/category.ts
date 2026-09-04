import type { Category, CategoryColor } from '@duo/shared';

export const CATEGORY_COLORS: CategoryColor[] = ['accent', 'ink', 'mist', 'violet', 'silver'];

export const TAG_SUGGESTIONS = ['PT', 'ED', 'AS', 'GI', 'PC', 'PS'];

export function suggestTag(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '??';
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return `${words[0]![0]}${words[1]![0]}`.toUpperCase();
}

export function visibleCategories(categories: Category[], userId: string): Category[] {
  return categories.filter(
    (category) => category.scope === 'shared' || category.ownerId === userId,
  );
}
