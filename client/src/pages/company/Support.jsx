import { useState } from 'react';
import { HelpCircle, Search, MessageSquare, X, Send } from 'lucide-react';

const MOCK_TICKETS = [
  { id: 'TCK-9281', user: 'Admin @ Springfield', issue: 'Cannot upload student CSV', priority: 'High', status: 'Open', date: '2 hours ago' },
  { id: 'TCK-9280', user: 'Teacher @ Riverdale', issue: 'Password reset link not working', priority: 'Medium', status: 'In Progress', date: '5 hours ago' },
  { id: 'TCK-9275', user: 'Admin @ Lakeside', issue: 'Billing invoice required', priority: 'Low', status: 'Resolved', date: 'Yesterday' },
];

export default function SupportTickets() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="text-indigo-600 dark:text-indigo-400" /> Support Ticket Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Resolve school admin and teacher platform issues.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">Ticket Details</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_TICKETS.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 dark:text-white">{ticket.issue}</p>
                    <p className="text-xs text-slate-500 mt-1">{ticket.id} • {ticket.date}</p>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">{ticket.user}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wider ${
                      ticket.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wider border ${
                      ticket.status === 'Open' ? 'border-rose-300 text-rose-600 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/10' :
                      ticket.status === 'In Progress' ? 'border-amber-300 text-amber-600 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10' :
                      'border-emerald-300 text-emerald-600 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/10'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      <MessageSquare size={16} /> Open Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat Style Side Panel */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 shrink-0">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">{selectedTicket.id}</h2>
                <p className="text-xs text-slate-500">{selectedTicket.issue}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col gap-1 max-w-[85%]">
                <span className="text-[10px] font-bold text-slate-500 ml-1">{selectedTicket.user}</span>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                  Hi, we are trying to upload our student roster CSV but it keeps throwing a validation error on row 45. Can someone look into this urgently?
                </div>
              </div>
              <div className="flex flex-col gap-1 max-w-[85%] self-end items-end ml-auto">
                <span className="text-[10px] font-bold text-slate-500 mr-1">Support Agent (You)</span>
                <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm">
                  Hello! I'm looking into this right now. Could you please ensure that the date format in your CSV matches YYYY-MM-DD?
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Type a reply..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-indigo-500 focus:ring-0 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none" />
                <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
