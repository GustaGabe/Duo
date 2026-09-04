import type { OwnerSlot } from '@duo/shared';

import { cn } from '@/lib/cn';
import { initials as toInitials } from '@/lib/format';
import { ownerSurface } from '@/lib/owner';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<AvatarSize, string> = {
  sm: 'size-7 text-micro',
  md: 'size-8.5 text-label',
  lg: 'size-9.5 text-label',
  xl: 'size-16.5 text-stat',
};

export interface AvatarProps {
  name: string;
  slot: OwnerSlot;
  size?: AvatarSize;
  ringed?: boolean;
  className?: string;
}

export function Avatar({ name, slot, size = 'md', ringed = false, className }: AvatarProps) {
  return (
    <span
      title={name}
      className={cn(
        'grid shrink-0 place-items-center rounded-pill font-semibold',
        SIZES[size],
        ownerSurface[slot],
        ringed && 'ring-2 ring-surface',
        className,
      )}
    >
      {toInitials(name)}
    </span>
  );
}

export interface AvatarStackProps {
  people: { id: string; name: string; slot: OwnerSlot }[];
  size?: AvatarSize;
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
