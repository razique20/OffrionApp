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
import FAQSupport from '@/components/FAQSupport';

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
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-sm font-medium text-muted-foreground">Opening support deck...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support & Knowledge</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Direct help for Partners.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-secondary/40 p-1 rounded-2xl border border-border flex">
              <button 
                onClick={() => setActiveTab('tickets')}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                  activeTab === 'tickets' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                My Tickets
              </button>
              <button 
                onClick={() => setActiveTab('faq')}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                  activeTab === 'faq' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                Knowledge Base (FAQ)
              </button>
           </div>
           <button 
             onClick={() => setShowNewTicket(true)}
             className="flex items-center justify-center gap-2 px-6 py-3 bg-premium-gradient text-white rounded-2xl font-bold hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all text-sm"
           >
             <Plus className="w-4 h-4" /> Open New Ticket
           </button>
        </div>
      </div>

      {activeTab === 'faq' ? (
        <div className="max-w-3xl mx-auto py-8">
           <FAQSupport />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
          {/* Ticket List */}
          <div className={cn(
            "lg:col-span-4 bg-card border border-border rounded-[32px] overflow-hidden flex flex-col shadow-xl",
            selectedTicket && "hidden lg:flex"
          )}>
             <div className="p-6 border-b border-border bg-secondary/20 flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Recent Tickets</h3>
                <Filter className="w-4 h-4 text-muted-foreground cursor-pointer" />
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {tickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                     <MessageSquare className="w-12 h-12 mb-3" />
                     <p className="text-sm font-bold">No active tickets</p>
                     <p className="text-xs uppercase tracking-tighter mt-1">Submit a request to start</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div 
                      key={ticket._id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer group",
                        selectedTicket?._id === ticket._id 
                          ? "bg-primary/5 border-primary shadow-sm" 
                          : "border-transparent hover:bg-secondary/40"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                         <span className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-full border", getStatusColor(ticket.status))}>
                           {ticket.status.replace('_', ' ')}
                         </span>
                         <span className="text-[10px] text-muted-foreground font-bold">
                           {new Date(ticket.createdAt).toLocaleDateString()}
                         </span>
                      </div>
                      <h4 className="font-bold text-sm truncate pr-4 group-hover:text-primary transition-colors">{ticket.subject}</h4>
                      <p className="text-xs text-muted-foreground truncate mt-1">{ticket.message}</p>
                    </div>
                  ))
                )}
             </div>
          </div>

          {/* Ticket Details / Chat */}
          <div className={cn(
            "lg:col-span-8 bg-card border border-border rounded-[32px] overflow-hidden flex flex-col shadow-xl",
            !selectedTicket && "hidden lg:flex items-center justify-center relative"
          )}>
             {selectedTicket ? (
               <>
                 <div className="p-6 border-b border-border bg-secondary/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedTicket(null)} className="lg:hidden p-2 hover:bg-secondary rounded-full">
                         <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                      <div>
                        <h3 className="font-bold text-lg">{selectedTicket.subject}</h3>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                           <Clock className="w-3 h-3" /> Started on {new Date(selectedTicket.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                       <span className={cn("text-[10px] uppercase font-black px-3 py-1 rounded-full border", getStatusColor(selectedTicket.status))}>
                         {selectedTicket.status.replace('_', ' ')}
                       </span>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-secondary/5">
                    {/* Original Message */}
                    <div className="flex flex-col gap-1 max-w-[85%] self-start">
                       <div className="p-4 rounded-2xl bg-secondary/40 border border-border text-sm leading-relaxed backdrop-blur-sm">
                          {selectedTicket.message}
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground px-2">You • {new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Responses */}
                    {selectedTicket.responses.map((res: any, idx: number) => (
                      <div key={idx} className={cn(
                        "flex flex-col gap-1 max-w-[85%]",
                        res.senderRole === 'partner' ? "self-end items-end" : "self-start"
                      )}>
                         <div className={cn(
                           "p-4 rounded-2xl text-sm leading-relaxed border transition-all",
                           res.senderRole === 'partner' 
                             ? "bg-premium-gradient text-white border-transparent shadow-lg shadow-primary/10" 
                             : "bg-background border-border shadow-sm backdrop-blur-md"
                         )}>
                            {res.message}
                         </div>
                         <span className="text-[10px] font-bold text-muted-foreground px-2">
                            {res.senderRole === 'admin' ? 'Offrion Team' : 'You'} • {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                    </div>
                    ))}
                 </div>

                 {/* Reply Input */}
                 <div className="p-6 bg-card border-t border-border">
                    <div className="relative group">
                      <input 
                        type="text"
                        disabled={selectedTicket.status === 'closed' || selectedTicket.status === 'resolved' || submitting}
                        placeholder={selectedTicket.status === 'closed' ? "This ticket is closed" : "Type your message..."}
                        className="w-full bg-secondary/40 border border-border rounded-2xl pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium disabled:opacity-50"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && replyMessage && !submitting && handleSendReply()}
                      />
                      <button 
                         onClick={handleSendReply}
                         disabled={!replyMessage || submitting || selectedTicket.status === 'closed'}
                         className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-premium-gradient text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-0 disabled:scale-0 duration-300"
                      >
                         {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-3 text-center font-bold uppercase tracking-widest animate-pulse">Our team typically responds in under 2 hours.</p>
                 </div>
               </>
             ) : (
               <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-primary/5">
                     <MessageSquare className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Ticket Selected</h3>
                  <p className="max-w-xs text-sm text-muted-foreground font-medium leading-relaxed">
                    Select a discussion from the left or open a new ticket to get dedicated help.
                  </p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* New Ticket Modal (Structured Questionnaire) */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-card w-full max-w-lg rounded-[32px] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent text-center">
                 <h3 className="text-2xl font-bold italic tracking-tight">Support Questionnaire</h3>
                 <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest">Help us help you faster</p>
              </div>
              <form onSubmit={handleCreateTicket} className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">What can we help with?</label>
                       <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'technical', label: 'Technical Issue' },
                            { id: 'billing', label: 'Billing & Sub' },
                            { id: 'partnership', label: 'Partnership' },
                            { id: 'other', label: 'General Inquiry' }
                          ].map(cat => (
                            <button
                              key={cat.id} type="button"
                              onClick={() => setNewTicket({...newTicket, category: cat.id})}
                              className={cn(
                                "py-2 px-3 rounded-xl border text-[10px] font-bold transition-all",
                                newTicket.category === cat.id 
                                  ? "bg-primary/10 border-primary text-primary shadow-sm" 
                                  : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/60"
                              )}
                            >
                              {cat.label}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Urgency Level</label>
                       <div className="flex gap-2">
                          {['low', 'medium', 'high'].map(p => (
                            <button
                              key={p} type="button"
                              onClick={() => setNewTicket({...newTicket, priority: p})}
                              className={cn(
                                "flex-1 py-2 px-4 rounded-xl border text-[10px] font-black uppercase transition-all",
                                newTicket.priority === p 
                                  ? "bg-primary text-white border-transparent shadow-lg shadow-primary/20" 
                                  : "bg-secondary/40 border-border text-muted-foreground"
                              )}
                            >
                              {p}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                       <input 
                         type="text" required
                         placeholder="Describe in a few words..."
                         className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                         value={newTicket.subject}
                         onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Detailed Explanation</label>
                       <textarea 
                         required rows={4}
                         placeholder="Please include relevant details, error messages, or deal IDs..."
                         className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none shadow-inner"
                         value={newTicket.message}
                         onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="flex items-center gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowNewTicket(false)}
                      className="flex-1 px-6 py-3.5 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" disabled={submitting}
                      className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-premium-gradient text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-primary/20 text-sm"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Request
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
