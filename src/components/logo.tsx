import { cn } from '@/lib/utils';
import { HeartHandshake } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xl font-bold text-primary',
        className
      )}
    >
      <HeartHandshake className="size-6" />
      <span className="group-data-[collapsible=icon]:hidden">
        Recoverantastic
      </span>
    </div>
  );
}
