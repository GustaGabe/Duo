import type { OwnerSlot } from '@duo/shared';

import { initials as toInitials } from '@/lib/format';
import { cn } from '@/lib/cn';
import { tv, type VariantProps } from '@/lib/tv';

export const avatar = tv({
  base: 'grid shrink-0 place-items-center rounded-pill font-semibold',
  variants: {
    slot: {
      a: 'bg-owner-a text-on-owner-a',
      b: 'bg-owner-b text-on-owner-b',
    },
    size: {
      sm: 'size-7 text-micro',
      md: 'size-8.5 text-label',
      lg: 'size-9.5 text-label',
      xl: 'size-16.5 text-stat',
    },
    ringed: { true: 'ring-2 ring-surface' },
  },
  defaultVariants: { size: 'md' },
});

export type AvatarVariants = VariantProps<typeof avatar>;

export interface AvatarProps extends AvatarVariants {
  name: string;
  slot: OwnerSlot;
  className?: string;
}

export function Avatar({ name, slot, size, ringed, className }: AvatarProps) {
  return (
    <span title={name} className={avatar({ slot, size, ringed, className })}>
      {toInitials(name)}
    </span>
  );
}

export interface AvatarStackProps {
  people: { id: string; name: string; slot: OwnerSlot }[];
  size?: AvatarVariants['size'];
  className?: string;
}

export function AvatarStack({ people, size = 'md', className }: AvatarStackProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {people.map((person, index) => (
        <Avatar
          key={person.id}
          name={person.name}
          slot={person.slot}
          size={size}
          ringed
          className={index > 0 ? '-ml-2.5' : undefined}
        />
      ))}
    </div>
  );
}
