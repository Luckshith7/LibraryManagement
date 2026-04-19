"use client";

import React, { useState, useMemo } from "react";
import { useStore, MemberStatus, User } from "@/app/store/useStore";
import Modal from "@/app/(components)/Modal";

const EMPTY_MEMBER = {
  name: '', email: '', tier: 'Scholar',
};

export default function MemberManagement() {
  const members = useStore(s => s.members).filter(m => m.role === 'Member');
  const updateMemberStatus = useStore(s => s.updateMemberStatus);
  const addMember = useStore(s => s.addMember);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_MEMBER });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember({ 
      ...form, 
      role: 'Member', 
      status: 'Active', 
      joined: new Date().getFullYear().toString() 
    } as any);
    setIsAdding(false);
    setForm({ ...EMPTY_MEMBER });
  };

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchesQuery = !query ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.id.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [members, query, statusFilter]);

  const activeCount = members.filter(m => m.status === 'Active').length;
  const suspendedCount = members.filter(m => m.status === 'Suspended').length;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-display-sm font-newsreader text-primary mb-1">Member Management</h1>
          <p className="text-body-md font-manrope text-on-surface-variant">
            {activeCount} active · {suspendedCount} suspended
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors text-label-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Register Scholar
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 bg-surface-container rounded-2xl px-5 py-3 flex items-center gap-3 focus-within:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 transition-all">
          <svg className="h-4 w-4 text-on-surface-variant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="bg-transparent border-none outline-none flex-1 font-manrope text-body-md text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'Active', 'Suspended'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-label-md font-manrope font-bold transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-surface-container-low rounded-2xl">
            <p className="font-newsreader text-title-lg text-on-surface-variant">No members found</p>
          </div>
        ) : (
          filtered.map(member => {
            const borrowedCount = member.borrowedBooks?.length || 0;
            const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);
            return (
              <div key={member.id} className="bg-surface-container-low rounded-2xl p-6 flex items-center gap-6">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-manrope font-bold text-label-lg flex-shrink-0 ${
                  member.status === 'Suspended'
                    ? 'bg-error-container text-on-error-container'
                    : 'bg-primary-container text-on-primary-container'
                }`}>
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-newsreader text-title-md text-on-surface">{member.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-label-xs font-manrope font-bold ${
                      member.status === 'Active'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {member.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-label-xs font-manrope bg-surface-container text-on-surface-variant">
                      {member.tier}
                    </span>
                  </div>
                  <p className="font-manrope text-body-sm text-on-surface-variant mt-0.5">{member.email}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-label-xs font-manrope text-on-surface-variant">ID: {member.id}</span>
                    <span className="text-label-xs font-manrope text-on-surface-variant">Since {member.joined}</span>
                    <span className="text-label-xs font-manrope text-on-surface-variant">{borrowedCount} items out</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {member.status === 'Active' ? (
                    <button
                      onClick={() => updateMemberStatus(member.id, 'Suspended')}
                      className="px-4 py-2 bg-error-container text-on-error-container font-manrope font-bold text-label-sm rounded-xl hover:bg-error hover:text-on-error transition-colors"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => updateMemberStatus(member.id, 'Active')}
                      className="px-4 py-2 bg-secondary-container text-on-secondary-container font-manrope font-bold text-label-sm rounded-xl hover:bg-secondary hover:text-on-secondary transition-colors"
                    >
                      Reinstate
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Registration Modal */}
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="Register New Scholar">
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-4">
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Research Tier</label>
                <select value={form.tier} onChange={e => setForm(f => ({...f, tier: e.target.value}))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope border border-outline-variant/30 focus:border-primary transition-all appearance-none">
                  <option>Scholar</option>
                  <option>Fellow</option>
                  <option>Researcher</option>
                </select>
              </div>
           </div>
           <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsAdding(false)}
              className="flex-1 py-3 bg-surface-container text-on-surface font-manrope font-bold rounded-xl hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors">
              Issue Credentials
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
