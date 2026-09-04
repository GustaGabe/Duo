import { tv } from '@/lib/tv';

export const navLink = tv({
  base: [
    'flex h-11 items-center rounded-control px-3.5 text-sm transition-colors',
    'text-on-invert-muted hover:bg-on-invert/10 hover:text-on-invert',
    'data-[status=active]:bg-accent data-[status=active]:font-medium',
    'data-[status=active]:text-on-accent data-[status=active]:hover:bg-accent',
  ],
});

export const navTab = tv({
  base: [
    'px-1 text-caption text-on-invert-muted transition-colors',
    'data-[status=active]:font-medium data-[status=active]:text-on-invert',
  ],
});

export const navRow = tv({
  base: 'py-3.5 text-section text-ink transition-colors data-[status=active]:text-accent',
});
