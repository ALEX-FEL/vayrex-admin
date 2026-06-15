'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MotifModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (motif: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
}

export function MotifModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmer',
  destructive = false,
}: MotifModalProps) {
  const [motif, setMotif] = useState('');
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (!motif.trim()) {
      setError(true);
      return;
    }
    onConfirm(motif.trim());
    setMotif('');
    setError(false);
  };

  const handleClose = () => {
    setMotif('');
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
              destructive ? 'bg-destructive/10' : 'bg-amber-50 dark:bg-amber-950/30'
            )}>
              <AlertTriangle className={cn('h-4 w-4', destructive ? 'text-destructive' : 'text-amber-600')} />
            </div>
            <DialogTitle className="text-sm font-bold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Motif <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Saisissez le motif de cette décision..."
              value={motif}
              onChange={(e) => { setMotif(e.target.value); setError(false); }}
              className={cn('resize-none text-sm min-h-[100px]', error && 'border-destructive focus-visible:ring-destructive')}
            />
            {error && (
              <p className="text-xs text-destructive">Le motif est obligatoire.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="text-sm">
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            className={cn('text-sm', destructive && 'bg-destructive hover:bg-destructive/90 text-destructive-foreground')}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
