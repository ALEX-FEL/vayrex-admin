'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { tickets as initialTickets } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquareWarning,
  Send,
  ChevronDown,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ticket, TicketStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  NON_LU: { label: 'Non lu', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800' },
  LU: { label: 'Lu', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800' },
  'RÉSOLU': { label: 'Résolu', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
};

export default function TicketsPage() {
  const [ticketList, setTicketList] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);

  const unreadCount = ticketList.filter((t) => t.status === 'NON_LU').length;
  const resolvedCount = ticketList.filter((t) => t.status === 'RÉSOLU').length;

  const openTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText('');
    if (ticket.status === 'NON_LU') {
      setTicketList((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: 'LU' as const } : t));
      setSelectedTicket({ ...ticket, status: 'LU' });
    }
  };

  const updateStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTicketList((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date() } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => prev ? { ...prev, status: newStatus, updatedAt: new Date() } : prev);
    }
    setOpenStatusMenu(null);
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMessage = {
      id: `tm-${Date.now()}`,
      senderType: 'ADMIN' as const,
      senderName: 'Admin',
      content: replyText,
      createdAt: new Date(),
    };
    setTicketList((prev) => prev.map((t) => t.id === selectedTicket.id ? { ...t, messages: [...t.messages, newMessage], updatedAt: new Date() } : t));
    setSelectedTicket((prev) => prev ? { ...prev, messages: [...prev.messages, newMessage], updatedAt: new Date() } : prev);
    setReplyText('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tickets</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {ticketList.length} tickets -- {unreadCount} non lus -- {resolvedCount} résolus
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Ticket List */}
          <div className="space-y-2">
            {ticketList.map((ticket) => {
              const cfg = statusConfig[ticket.status];
              const lastMsg = ticket.messages[ticket.messages.length - 1];
              return (
                <button
                  key={ticket.id}
                  onClick={() => openTicket(ticket)}
                  className={cn(
                    'w-full rounded-xl border text-left p-4 transition-all hover:shadow-sm',
                    selectedTicket?.id === ticket.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card',
                    ticket.status === 'NON_LU' && 'border-l-4 border-l-amber-400'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{ticket.reference}</span>
                    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', cfg.className)}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold line-clamp-1">{ticket.subject}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{ticket.reporterName} ({ticket.reporterType === 'CLIENT' ? 'Client' : 'Chauffeur'})</span>
                    <span className="text-[10px] text-muted-foreground">{format(ticket.updatedAt, 'dd/MM/yy HH:mm', { locale: fr })}</span>
                  </div>
                  {lastMsg && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2">{lastMsg.content}</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold">{selectedTicket.subject}</h2>
                        <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', statusConfig[selectedTicket.status].className)}>
                          {statusConfig[selectedTicket.status].label}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{selectedTicket.reference}</span>
                        <span>--</span>
                        <span>{selectedTicket.reporterName} ({selectedTicket.reporterType === 'CLIENT' ? 'Client' : 'Chauffeur'})</span>
                        <span>--</span>
                        <span>{format(selectedTicket.createdAt, 'dd MMM yyyy HH:mm', { locale: fr })}</span>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenStatusMenu(openStatusMenu === selectedTicket.id ? null : selectedTicket.id)}
                        className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium cursor-pointer', statusConfig[selectedTicket.status].className)}
                      >
                        {statusConfig[selectedTicket.status].label}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {openStatusMenu === selectedTicket.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenStatusMenu(null)} />
                          <div className="absolute right-0 top-9 z-50 w-32 rounded-md border border-border bg-card shadow-lg">
                            {selectedTicket.status !== 'LU' && selectedTicket.status !== 'RÉSOLU' && (
                              <button onClick={() => updateStatus(selectedTicket.id, 'LU')} className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 text-blue-700">
                                Lu
                              </button>
                            )}
                            {selectedTicket.status !== 'RÉSOLU' && (
                              <button onClick={() => updateStatus(selectedTicket.id, 'RÉSOLU')} className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 text-emerald-700">
                                Résolu
                              </button>
                            )}
                            {selectedTicket.status === 'RÉSOLU' && (
                              <button onClick={() => updateStatus(selectedTicket.id, 'LU')} className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 text-blue-700">
                                Rouvrir
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold">Discussion</h3>
                  <div className="space-y-3">
                    {selectedTicket.messages.map((msg) => (
                      <div key={msg.id} className={cn('flex', msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[75%] rounded-xl px-4 py-2.5',
                          msg.senderType === 'ADMIN'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-medium opacity-80">{msg.senderName}</span>
                            <span className="text-[9px] opacity-60">{format(msg.createdAt, 'HH:mm', { locale: fr })}</span>
                          </div>
                          <p className="text-xs leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply */}
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Écrire une réponse..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="h-9 text-sm flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendReply();
                        }
                      }}
                    />
                    <Button size="sm" onClick={sendReply} disabled={!replyText.trim()} className="gap-1.5">
                      <Send className="h-3.5 w-3.5" />
                      Envoyer
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
                <div className="text-center">
                  <MessageSquareWarning className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">Sélectionnez un ticket pour voir la discussion</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
