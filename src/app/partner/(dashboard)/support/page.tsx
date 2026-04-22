'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Loader2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FAQSupport } from '@/components/FAQSupport';

export default function PartnerSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    category: 'technical'
  });

  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support');
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTicket,
          subject: `[${newTicket.category.toUpperCase()}] ${newTicket.subject}`
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTickets([data.ticket, ...tickets]);
        setShowNewTicket(false);
        setNewTicket({ subject: '', message: '', priority: 'medium', category: 'technical' });
        setActiveTab('tickets');
      }
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage || !selectedTicket) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/support/${selectedTicket._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        const updatedTicket = { ...selectedTicket, responses: [...selectedTicket.responses, data.response] };
        setSelectedTicket(updatedTicket);
        setTickets(tickets.map(t => t._id === updatedTicket._id ? updatedTicket : t));
        setReplyMessage('');
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'in_progress': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'resolved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'closed': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      <span className="text-sm font-medium text-muted-foreground">Opening support deck...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support & Knowledge</h1>
          <p className="text-muted-foreground">Get help and read integration guides.</p>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-md border border-border w-fit">
          <button
            onClick={() => setActiveTab('tickets')}
            className={cn(
              "px-6 py-2 rounded-md text-xs font-bold transition-all",
              activeTab === 'tickets' 
                ? "bg-secondary text-white border border-border shadow-none" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={cn(
              "px-6 py-2 rounded-md text-xs font-bold transition-all",
              activeTab === 'faq' 
                ? "bg-secondary text-white border border-border shadow-none" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            FAQ
          </button>
        </div>
      </div>

      {activeTab === 'faq' ? (
        <div className="max-w-3xl py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <FAQSupport />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end mb-4">
               <button 
                 onClick={() => setShowNewTicket(true)}
                 className="flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary text-foreground border border-border rounded-md font-bold hover:scale-[1.02] shadow-none shadow-primary/20 transition-all text-sm"
               >
                 <Plus className="w-4 h-4" /> New Ticket
               </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-350px)]">
            {/* Ticket List */}
            <div className={cn(
              "lg:col-span-4 bg-card border border-border rounded-md overflow-hidden flex flex-col shadow-none",
              selectedTicket && "hidden lg:flex"
            )}>
               <div className="p-6 border-b border-border bg-secondary/20 flex items-center justify-between">
                  <h3 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Tickets</h3>
                  <Filter className="w-4 h-4 text-muted-foreground" />
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                       <MessageSquare className="w-10 h-10 mb-3" />
                       <p className="text-xs font-bold uppercase">No active tickets</p>
                    </div>
                  ) : (
                    tickets.map(ticket => (
                      <div 
                        key={ticket._id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={cn(
                          "p-4 rounded-md border transition-all cursor-pointer group",
                          selectedTicket?._id === ticket._id 
                            ? "bg-muted border-primary shadow-none" 
                            : "border-transparent hover:bg-secondary/40"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                           <span className={cn("text-[9px] uppercase font-black px-2 py-0.5 rounded-full border", getStatusColor(ticket.status))}>
                             {ticket.status.replace('_', ' ')}
                           </span>
                           <span className="text-[9px] text-muted-foreground font-bold">
                             {new Date(ticket.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                        <h4 className="font-bold text-sm truncate pr-4 group-hover:text-foreground transition-colors">{ticket.subject}</h4>
                        <p className="text-xs text-muted-foreground truncate mt-1">{ticket.message}</p>
                      </div>
                    ))
                  )}
               </div>
            </div>

            {/* Ticket Chat */}
            <div className={cn(
              "lg:col-span-8 bg-card border border-border rounded-md overflow-hidden flex flex-col shadow-none relative",
              !selectedTicket && "hidden lg:flex items-center justify-center"
            )}>
               {selectedTicket ? (
                 <>
                   <div className="p-6 border-b border-border bg-secondary/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedTicket(null)} className="lg:hidden p-2 hover:bg-secondary rounded-full">
                           <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        <div>
                          <h3 className="font-bold text-base">{selectedTicket.subject}</h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                             <Clock className="w-3 h-3" /> {new Date(selectedTicket.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-secondary/5">
                      <div className="flex flex-col gap-1 max-w-[85%] self-start">
                         <div className="p-4 rounded-md bg-secondary/40 border border-border text-xs leading-relaxed">
                            {selectedTicket.message}
                         </div>
                         <span className="text-[9px] font-bold text-muted-foreground px-2">You • {new Date(selectedTicket.createdAt).toLocaleTimeString()}</span>
                      </div>

                      {selectedTicket.responses.map((res: any, idx: number) => (
                        <div key={idx} className={cn(
                          "flex flex-col gap-1 max-w-[85%]",
                          res.senderRole === 'partner' ? "self-end items-end" : "self-start"
                        )}>
                           <div className={cn(
                             "p-4 rounded-md text-xs leading-relaxed border transition-all",
                             res.senderRole === 'partner' 
                               ? "bg-secondary text-white border border-border border-transparent" 
                               : "bg-background border-border"
                           )}>
                              {res.message}
                           </div>
                           <span className="text-[9px] font-bold text-muted-foreground px-2">
                              {res.senderRole === 'admin' ? 'Offrion Team' : 'You'} • {new Date(res.createdAt).toLocaleTimeString()}
                           </span>
                      </div>
                      ))}
                   </div>

                   <div className="p-4 bg-card border-t border-border">
                      <div className="relative">
                        <input 
                          type="text"
                          disabled={selectedTicket.status === 'closed' || selectedTicket.status === 'resolved' || submitting}
                          placeholder="Type your message..."
                          className="w-full bg-secondary/40 border border-border rounded-md pl-4 pr-12 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium disabled:opacity-50"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && replyMessage && !submitting && handleSendReply()}
                        />
                        <button 
                           onClick={handleSendReply}
                           disabled={!replyMessage || submitting || selectedTicket.status === 'closed'}
                           className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-secondary text-foreground border border-border rounded-lg shadow-none"
                        >
                           {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="flex flex-col items-center justify-center p-12 text-center h-full opacity-40">
                    <MessageSquare className="w-12 h-12 mb-4" />
                    <h3 className="font-bold">Select a Ticket</h3>
                    <p className="text-xs max-w-[200px] mt-1">Select a discussion from the left or open a new ticket for help.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-card w-full max-w-lg rounded-md border border-border shadow-none overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-border bg-secondary/20 text-center">
                 <h3 className="text-xl font-bold">New Support Ticket</h3>
                 <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">Help us help you faster</p>
              </div>
              <form onSubmit={handleCreateTicket} className="p-8 space-y-4">
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                       {['technical', 'billing', 'partnership', 'other'].map(cat => (
                         <button
                           key={cat} type="button"
                           onClick={() => setNewTicket({...newTicket, category: cat})}
                           className={cn(
                             "py-2 px-3 rounded-md border text-[10px] font-bold capitalize transition-all",
                             newTicket.category === cat ? "bg-secondary border-primary text-white" : "bg-secondary/40 border-border text-muted-foreground"
                           )}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                    <input 
                      type="text" required
                      placeholder="Subject"
                      className="w-full bg-secondary/50 border border-border rounded-md px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    />
                    <textarea 
                      required rows={4}
                      placeholder="Description"
                      className="w-full bg-secondary/50 border border-border rounded-md px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none shadow-inner"
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    />
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowNewTicket(false)} className="flex-1 py-3 bg-secondary rounded-md font-bold text-xs">Cancel</button>
                    <button type="submit" disabled={submitting} className="flex-[2] py-3 bg-secondary text-foreground border border-border rounded-md font-bold text-xs shadow-none">
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
