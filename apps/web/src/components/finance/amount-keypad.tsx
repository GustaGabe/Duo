import { cn } from '@/lib/cn';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'];

export function AmountKeypad({
  onPress,
  onDelete,
  className,
}: {
  onPress: (digit: string) => void;
  onDelete: () => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-3', className)}>
      {KEYS.map((key) => {
        const isDelete = key === '⌫';
        const isSeparator = key === ',';
        return (
          <button
            key={key}
            type="button"
            aria-label={isDelete ? 'Apagar' : key}
            disabled={isSeparator}
            onClick={() => (isDelete ? onDelete() : onPress(key))}
            className="h-13.5 cursor-pointer rounded-field text-2xl font-medium text-ink transition-colors hover:bg-surface-2 disabled:cursor-default disabled:bg-transparent disabled:text-subtle"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
