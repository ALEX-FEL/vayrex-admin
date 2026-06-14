'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Columns3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnVisibilityProps {
  columns: { key: string; label: string }[];
  visibleColumns: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function ColumnVisibility({ columns, visibleColumns, onToggle }: ColumnVisibilityProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 h-9"
        onClick={() => setOpen(!open)}
      >
        <Columns3 className="h-3.5 w-3.5" />
        Colonnes
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-48 rounded-md border border-border bg-card shadow-lg py-1">
            {columns.map((col) => (
              <button
                key={col.key}
                onClick={() => onToggle(col.key)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted/50"
              >
                <div className={cn(
                  'flex h-3.5 w-3.5 items-center justify-center rounded border',
                  visibleColumns[col.key] ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                )}>
                  {visibleColumns[col.key] && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                </div>
                {col.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function useColumnVisibility(keys: string[], defaultHidden: string[] = []) {
  const initial: Record<string, boolean> = {};
  keys.forEach((key) => {
    initial[key] = !defaultHidden.includes(key);
  });

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(initial);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isVisible = (key: string) => visibleColumns[key] !== false;

  return { visibleColumns, toggleColumn, isVisible };
}
