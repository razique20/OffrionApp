'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Loader2,
  ChevronRight,
  Search,
  User,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/support');
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

  const handleSendReply = async (status: string = 'in_progress') => {
    if (!replyMessage || !selectedTicket) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/support/${selectedTicket._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage, status }),
      });
      const data = await res.json();
      if (res.ok) {
        const updatedTicket = data.ticket;
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

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `System: Status updated to ${status}`, status }),
      });
      const data = await res.json();
      if (res.ok) {
        const updatedTicket = data.ticket;
        if (selectedTicket?._id === id) setSelectedTicket(updatedTicket);
        setTickets(tickets.map(t => t._id === id ? updatedTicket : t));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
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

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      <span className="text-sm font-medium text-muted-foreground">Accessing support vault...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Governance</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage and resolve partner & merchant requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
        {/* Ticket Feed */}
        <div className={cn(
          "lg:col-span-4 bg-card border border-border rounded-md overflow-hidden flex flex-col shadow-none",
          selectedTicket && "hidden lg:flex"
        )}>
           <div className="p-6 border-b border-border bg-secondary/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Active Tickets</h3>
                <span className="bg-secondary text-foreground text-[10px] font-black px-2 py-0.5 rounded-full">{filteredTickets.length} Total</span>
              </div>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                   type="text" 
                   placeholder="Search tickets or users..."
                   className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                   <ShieldCheck className="w-12 h-12 mb-3" />
                   <p className="text-sm font-bold">No tickets found</p>
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <div 
                    key={ticket._id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "p-4 rounded-md border transition-all cursor-pointer group relative",
                      selectedTicket?._id === ticket._id 
                        ? "bg-muted border-primary shadow-none" 
                        : "border-transparent hover:bg-secondary/40"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                       <span className={cn("text-[9px] uppercase font-black px-2 py-0.5 rounded-full border", getStatusColor(ticket.status))}>
                         {ticket.status.replace('_', ' ')}
                       </span>
                       <span className={cn(
                         "text-[8px] uppercase font-bold tracking-tighter px-1.5 py-0.5 rounded-md border",
                         ticket.userRole === 'merchant' ? "border-blue-500/30 text-blue-500 bg-blue-500/5" : "border-purple-500/30 text-purple-500 bg-purple-500/5"
                       )}>
                         {ticket.userRole}
                       </span>
                    </div>
                    <h4 className="font-bold text-sm truncate pr-8 group-hover:text-foreground transition-colors">{ticket.subject}</h4>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                          <User className="w-3 h-3 text-muted-foreground" />
                       </div>
                       <span className="text-[10px] font-medium text-muted-foreground truncate">{ticket.userId?.name || 'Unknown User'}</span>
                    </div>
                    {ticket.priority === 'urgent' && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-4 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-none shadow-red-500/50" />
                    )}
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Message Thread */}
        <div className={cn(
          "lg:col-span-8 bg-card border border-border rounded-md overflow-hidden flex flex-col shadow-none",
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
                      <div className="flex items-center gap-3 mt-1">
                         <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 capitalize">
                            <User className="w-3 h-3" /> {selectedTicket.userId?.name} ({selectedTicket.userRole})
                         </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <select 
                       value={selectedTicket.status}
                       onChange={(e) => updateStatus(selectedTicket._id, e.target.value)}
                       className={cn(
                         "text-[10px] font-black uppercase px-3 py-1.5 rounded-full border bg-transparent focus:outline-none cursor-pointer transition-all",
                         getStatusColor(selectedTicket.status)
                       )}
                     >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                     </select>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-secondary/5">
                  {/* Partner's Original Issue */}
                  <div className="flex flex-col gap-1 max-w-[85%] self-start">
                     <div className="p-4 rounded-md bg-secondary/40 border border-border text-sm leading-relaxed backdrop-blur-sm">
                        <div className="mb-2 pb-2 border-b border-border/50">
                           <span className={cn(
                             "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                             selectedTicket.priority === 'high' || selectedTicket.priority === 'urgent' ? "text-red-500 border-red-500/20 bg-red-500/10" : "text-muted-foreground border-border bg-secondary/20"
                           )}>
                             {selectedTicket.priority} Priority
                           </span>
                        </div>
                        {selectedTicket.message}
                     </div>
                     <span className="text-[10px] font-bold text-muted-foreground px-2">Partner • {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Thread Persistence */}
                  {selectedTicket.responses.map((res: any, idx: number) => (
                    <div key={idx} className={cn(
                      "flex flex-col gap-1 max-w-[85%]",
                      res.senderRole === 'admin' ? "self-end items-end" : "self-start"
                    )}>
                       <div className={cn(
                         "p-4 rounded-md text-sm leading-relaxed border transition-all shadow-none",
                         res.senderRole === 'admin' 
                           ? "bg-primary text-white border-transparent" 
                           : "bg-background border-border"
                       )}>
                          {res.message}
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground px-2">
                          {res.senderRole === 'admin' ? 'You (Admin)' : 'Partner'} • {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  ))}
               </div>

               {/* Admin Input */}
               <div className="p-6 bg-card border-t border-border">
                  <div className="relative group">
                    <textarea 
                      rows={2}
                      disabled={selectedTicket.status === 'closed' || submitting}
                      placeholder={selectedTicket.status === 'closed' ? "This ticket is closed" : "Type your official response..."}
                      className="w-full bg-secondary/40 border border-border rounded-md pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium disabled:opacity-50 resize-none"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                       <button 
                          onClick={() => handleSendReply('resolved')}
                          disabled={!replyMessage || submitting || selectedTicket.status === 'closed'}
                          title="Reply and Resolve"
                          className="p-2.5 bg-green-500/10 text-green-500 rounded-md hover:bg-green-500/20 transition-all disabled:opacity-0 disabled:scale-0"
                       >
                          <CheckCircle2 className="w-4 h-4" />
                       </button>
                       <button 
                          onClick={() => handleSendReply('in_progress')}
                          disabled={!replyMessage || submitting || selectedTicket.status === 'closed'}
                          className="p-2.5 bg-primary text-foreground rounded-md shadow-none hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-0 disabled:scale-0"
                       >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 px-2">
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black italic">Operational Governance Protocol</p>
                     <div className="flex gap-4">
                        <button 
                          onClick={() => updateStatus(selectedTicket._id, 'closed')}
                          className="text-[10px] font-bold text-red-500 hover:underline uppercase"
                        >
                          Close Ticket
                        </button>
                     </div>
                  </div>
               </div>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="w-20 h-20 bg-secondary text-foreground rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-primary/5">
                   <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Governance Console</h3>
                <p className="max-w-xs text-sm text-muted-foreground font-medium leading-relaxed">
                  Select a partner request to begin investigation and provide resolution.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
