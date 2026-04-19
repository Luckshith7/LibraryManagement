"use client";

import React, { useState } from "react";
import { useStore, UserRole } from "@/app/store/useStore";
import { useRouter } from "next/navigation";

const ROLES = ['Assistant Archivist', 'Curator', 'Senior Administrator'];

export default function AdminOnboarding() {
  const addMember = useStore(s => s.addMember);
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    role: 'Curator' as string, tier: 'Curator',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      role: 'Member' as UserRole,
      tier: form.tier,
      status: 'Active',
      joined: new Date().getFullYear().toString(),
    });
    setSubmitted(true);
    setTimeout(() => {
      router.push('/admin/members');
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-xl py-24 text-center mx-auto">
        <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-on-secondary-container" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-display-xs font-newsreader text-primary mb-3">Credentials Issued</h2>
        <p className="font-manrope text-body-md text-on-surface-variant">
          {form.firstName} {form.lastName} has been successfully onboarded. Redirecting to Members...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-display-sm font-newsreader text-primary mb-2">Register Curator</h1>
        <p className="text-body-md font-manrope text-on-surface-variant">
          Grant access to a new archivist. They will receive institutional credentials upon registration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-3xl p-10 space-y-8">
        <section className="space-y-5">
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">First Name *</label>
              <input
                required
                value={form.firstName}
                onChange={e => setForm(f => ({...f, firstName: e.target.value}))}
                className="w-full bg-surface rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all"
                placeholder="Eleanor"
              />
            </div>
            <div>
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Last Name *</label>
              <input
                required
                value={form.lastName}
                onChange={e => setForm(f => ({...f, lastName: e.target.value}))}
                className="w-full bg-surface rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all"
                placeholder="Vance"
              />
            </div>
          </div>
          <div>
            <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Institutional Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="w-full bg-surface rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_#012d1d] transition-shadow"
              placeholder="e.vance@institution.edu"
            />
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-outline-variant/20">
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold">Access Level</h2>
          <div className="space-y-3">
            {ROLES.map(role => (
              <label key={role} className="flex items-center gap-4 p-4 bg-surface rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  form.tier === role
                    ? 'border-primary bg-primary'
                    : 'border-outline-variant bg-surface'
                }`}>
                  {form.tier === role && <div className="w-2 h-2 bg-on-primary rounded-full" />}
                </div>
                <div onClick={() => setForm(f => ({...f, tier: role}))}>
                  <p className="font-manrope text-body-md text-on-surface font-medium">{role}</p>
                  <p className="font-manrope text-label-sm text-on-surface-variant">
                    {role === 'Assistant Archivist' ? 'Read-only catalog access'
                      : role === 'Curator' ? 'Full inventory management rights'
                      : 'All permissions including user management'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3.5 bg-surface-container text-on-surface font-manrope font-bold rounded-xl hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3.5 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors"
          >
            Issue Credentials
          </button>
        </div>
      </form>
    </div>
  );
}
