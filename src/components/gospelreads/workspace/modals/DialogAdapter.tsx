import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export function DialogAdapter({
  isOpen,
  title,
  message,
  onClose,
  children
}: {
  isOpen: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-surface dark:bg-[#0c0c0e] border-outline-variant rounded-2xl font-sans">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">{title}</DialogTitle>
          {message && <DialogDescription className="text-on-surface-variant font-sans">{message}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
