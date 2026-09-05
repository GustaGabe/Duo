import type { Space } from '@duo/shared';

import { tv, type VariantProps } from '@/lib/tv';

export const spaceMark = tv({
  base: 'grid shrink-0 place-items-center font-semibold uppercase',
  variants: {
    tone: {
      a: 'bg-owner-a text-on-owner-a',
      b: 'bg-owner-b text-on-owner-b',
      c: 'bg-owner-c text-on-owner-c',
      d: 'bg-owner-d text-on-owner-d',
    },
    size: {
      sm: 'size-9 rounded-control text-caption',
      md: 'size-11 rounded-field text-body',
      lg: 'size-13 rounded-panel text-section',
    },
  },
  defaultVariants: { size: 'md' },
});

export type SpaceMarkVariants = VariantProps<typeof spaceMark>;

const TONES = ['a', 'b', 'c', 'd'] as const;

export type SpaceTone = (typeof TONES)[number];

export function spaceTones(spaces: Pick<Space, 'id'>[]): Record<string, SpaceTone> {
  return Object.fromEntries(
    spaces.map((space, index) => [space.id, TONES[index % TONES.length]!]),
  );
}

export function initialsForSpace(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '??';
  if (words.length === 1) return words[0]!.slice(0, 2);
  return `${words[0]![0]}${words[1]![0]}`;
}

export function SpaceMark({
  space,
  tone = 'a',
  size,
  className,
}: {
  space: Pick<Space, 'id' | 'name'>;
  tone?: SpaceTone;
  size?: SpaceMarkVariants['size'];
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={spaceMark({ tone, size, className })}>
      {initialsForSpace(space.name)}
    </span>
  );
}
