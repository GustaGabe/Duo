import type { Space } from '@duo/shared';

import { AvatarStack } from '@/components/ui/avatar';
import { cn } from '@/lib/cn';

import { SpaceMark, type SpaceTone } from './space-mark';

export function SpaceSwitcher({
  spaces,
  activeId,
  tones,
  onPick,
}: {
  spaces: Space[];
  activeId: string | undefined;
  tones: Record<string, SpaceTone>;
  onPick: (spaceId: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {spaces.map((space) => {
        const isActive = space.id === activeId;
        return (
          <li key={space.id}>
            <button
              type="button"
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onPick(space.id)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-panel border-[1.5px] p-3 text-left transition-colors',
                isActive
                  ? 'border-accent bg-accent/8'
                  : 'border-line hover:bg-surface-2',
              )}
            >
              <SpaceMark space={space} tone={tones[space.id]} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body font-medium text-ink">{space.name}</span>
                <span className="block text-caption text-muted">
                  {space.members.length} {space.members.length === 1 ? 'pessoa' : 'pessoas'}
                </span>
              </span>
              <AvatarStack people={space.members} size="sm" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
