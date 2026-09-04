import { useState, type ComponentProps } from 'react';

import { cn } from '@/lib/cn';

export function PasswordInput({ className, ...props }: ComponentProps<'input'>) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={cn(
        'flex h-14 w-full items-center rounded-field border-[1.5px] border-line bg-surface px-4 lg:h-13',
        'focus-within:border-accent focus-within:shadow-[var(--shadow-focus)]',
        className,
      )}
    >
      <input
        type={visible ? 'text' : 'password'}
        className="min-w-0 flex-1 bg-transparent text-lg tracking-[0.2em] text-ink outline-none placeholder:tracking-normal placeholder:text-subtle"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="cursor-pointer pl-3 font-mono text-micro font-medium tracking-[0.08em] text-accent"
      >
        {visible ? 'OCULTAR' : 'VER'}
      </button>
    </div>
  );
}
