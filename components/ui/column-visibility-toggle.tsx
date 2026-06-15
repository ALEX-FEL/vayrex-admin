'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Columns3 } from 'lucide-react';

interface ColumnVisibilityToggleProps {
  columns: string[];
  hidden: Set<string>;
  onToggle: (column: string) => void;
  locked?: string[]; // columns that cannot be hidden
}

export function ColumnVisibilityToggle({
  columns,
  hidden,
  onToggle,
  locked = [],
}: ColumnVisibilityToggleProps) {
  const visibleCount = columns.length - hidden.size;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-9 text-sm whitespace-nowrap">
          <Columns3 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Colonnes</span>
          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            {visibleCount}/{columns.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Colonnes visibles
        </p>
        <div className="space-y-2">
          {columns.map((col) => {
            const isLocked = locked.includes(col);
            const isVisible = !hidden.has(col);
            return (
              <div key={col} className="flex items-center gap-2.5">
                <Checkbox
                  id={`col-${col}`}
                  checked={isVisible}
                  disabled={isLocked}
                  onCheckedChange={() => !isLocked && onToggle(col)}
                  className="h-3.5 w-3.5"
                />
                <Label
                  htmlFor={`col-${col}`}
                  className={`text-xs cursor-pointer select-none ${isLocked ? 'text-muted-foreground/50' : ''}`}
                >
                  {col}
                </Label>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
