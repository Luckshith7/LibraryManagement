"use client";

import React, { useState } from "react";
import { useStore, BookStatus } from "@/app/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/app/(components)/Modal";
import Image from "next/image";

const STATUSES: BookStatus[] = ['Available', 'Borrowed', 'Reserved', 'Missing'];

const EMPTY_BOOK = {
  title: '', author: '', year: new Date().getFullYear(), isbn: '',
  publisher: '', pages: 0, tags: [], status: 'Available' as BookStatus,
  synopsis: '', callNumber: '', coverImage: '',
};

const EMPTY_MEMBER = {
  name: '', email: '', tier: 'Scholar',
};

export default function AdminDashboard() {
  const books = useStore(s => s.books);
  const members = useStore(s => s.members);
  const logs = useStore(s => s.logs);
  const addBook = useStore(s => s.addBook);
  const addMember = useStore(s => s.addMember);
  const addToast = useStore(s => s.addToast);

  const [isAddingVolume, setIsAddingVolume] = useState(false);
  const [isRegisteringScholar, setIsRegisteringScholar] = useState(false);
  const [bookForm, setBookForm] = useState({ ...EMPTY_BOOK });
  const [memberForm, setMemberForm] = useState({ ...EMPTY_MEMBER });
  const [tagsInput, setTagsInput] = useState("");

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    addBook({ ...bookForm, tags });
    setIsAddingVolume(false);
    setBookForm({ ...EMPTY_BOOK });
    setTagsInput("");
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember({ ...memberForm, role: 'Member', status: 'Active', joined: new Date().getFullYear().toString() } as any);
    setIsRegisteringScholar(false);
    setMemberForm({ ...EMPTY_MEMBER });
  };

  const stats = [
    { 
      label: "Total Collection", 
      value: books.length, 
      sub: "Volumes cataloged",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      color: "bg-blue-500/10 text-blue-600"
    },
    { 
      label: "Active Scholars", 
      value: members.filter(m => m.role === 'Member').length, 
      sub: "Verified researchers",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M14.25 5.25a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0zm7.45 14.25a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
        </svg>
      ),
      color: "bg-emerald-500/10 text-emerald-600"
    },
    { 
      label: "Availability", 
      value: books.filter(b => b.status === "Available").length, 
      sub: "Ready for circulation",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-amber-500/10 text-amber-600"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-display-md font-newsreader text-primary mb-2">Archival Command Center</h1>
        <p className="text-body-lg font-manrope text-on-surface-variant">System oversight and real-time repository health.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/30 relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-display-sm font-newsreader text-primary mb-1">{stat.value}</p>
            <p className="text-title-md font-manrope font-bold text-on-surface uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-label-md font-manrope text-on-surface-variant">{stat.sub}</p>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-headline-sm font-newsreader text-primary">System Activity</h2>
            <button className="text-label-md font-manrope text-primary font-bold hover:underline decoration-2 underline-offset-4">Export Logs</button>
          </div>
          
          <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 overflow-hidden shadow-sm">
            {logs.length === 0 ? (
              <div className="p-20 text-center text-on-surface-variant/40 font-manrope">No recent activities recorded.</div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {logs.slice(0, 10).map((log) => (
                  <div key={log.id} className="p-6 flex items-start gap-5 hover:bg-surface-container-low/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-title-sm font-manrope font-bold text-on-surface">{log.action}</p>
                        <span className="text-label-sm font-manrope text-on-surface-variant/60">{log.timestamp}</span>
                      </div>
                      <p className="text-body-md font-manrope text-on-surface-variant mb-2">{log.details}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary text-[10px] text-on-primary flex items-center justify-center font-bold">
                          {log.user.charAt(0)}
                        </div>
                        <span className="text-label-sm font-manrope text-on-surface-variant font-medium">{log.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-headline-sm font-newsreader text-primary px-2">Quick Actions</h2>
          <div className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/30 space-y-4">
             <button 
               onClick={() => setIsAddingVolume(true)}
               className="w-full py-4 px-6 bg-primary text-on-primary rounded-2xl font-manrope font-bold text-label-lg flex items-center justify-between group hover:shadow-lg hover:shadow-primary/20 transition-all"
             >
                Add New Volume
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
             </button>
             <button 
               onClick={() => setIsRegisteringScholar(true)}
               className="w-full py-4 px-6 bg-surface-container-highest text-on-surface rounded-2xl font-manrope font-bold text-label-lg flex items-center justify-between group hover:bg-surface-container-high transition-all"
             >
                Register Scholar
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
             </button>
             <div className="pt-6">
               <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                 <h3 className="text-label-sm font-manrope font-bold text-primary uppercase tracking-widest mb-2">Vault Health</h3>
                 <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                 </div>
                 <p className="mt-3 text-label-sm font-manrope text-on-surface-variant italic">85% of physical stock verified today.</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Vol. Add Modal */}
      <Modal isOpen={isAddingVolume} onClose={() => setIsAddingVolume(false)} title="Add New Volume">
        <form onSubmit={handleBookSubmit} className="space-y-5">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Title *</label>
                <input required value={bookForm.title} onChange={e => setBookForm(f => ({...f, title: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Author *</label>
                <input required value={bookForm.author} onChange={e => setBookForm(f => ({...f, author: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Call Number</label>
                <input value={bookForm.callNumber} onChange={e => setBookForm(f => ({...f, callNumber: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
              <div className="col-span-2">
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Tags</label>
                <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="History, Art, Science..."
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
           </div>
           <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-xl font-manrope font-bold uppercase tracking-widest">Register Volume</button>
        </form>
      </Modal>

      {/* Member Add Modal */}
      <Modal isOpen={isRegisteringScholar} onClose={() => setIsRegisteringScholar(false)} title="Register New Scholar">
        <form onSubmit={handleMemberSubmit} className="space-y-5">
           <div className="space-y-4">
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Full Name *</label>
                <input required value={memberForm.name} onChange={e => setMemberForm(f => ({...f, name: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Email *</label>
                <input required type="email" value={memberForm.email} onChange={e => setMemberForm(f => ({...f, email: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Research Tier</label>
                <select value={memberForm.tier} onChange={e => setMemberForm(f => ({...f, tier: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all appearance-none">
                  <option>Scholar</option>
                  <option>Fellow</option>
                  <option>Researcher</option>
                </select>
              </div>
           </div>
           <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-xl font-manrope font-bold uppercase tracking-widest">Issue Credentials</button>
        </form>
      </Modal>
    </div>
  );
}
