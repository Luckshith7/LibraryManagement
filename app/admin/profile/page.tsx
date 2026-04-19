"use client";

import React from "react";
import { useStore } from "@/app/store/useStore";
import Link from "next/link";

export default function AdminProfile() {
  const currentUser = useStore(s => s.currentUser);
  const books = useStore(s => s.books);
  const members = useStore(s => s.members);

  const stats = [
    { label: 'Total Volumes', value: books.length },
    { label: 'Available', value: books.filter(b => b.status === 'Available').length },
    { label: 'Active Members', value: members.filter(m => m.status === 'Active').length },
    { label: 'Items Out', value: books.filter(b => b.status === 'Borrowed').length },
  ];

  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'A';

  return (
    <div className="max-w-3xl space-y-10">
      <h1 className="text-display-sm font-newsreader text-primary">Admin Profile</h1>

      {/* Identity */}
      <div className="bg-primary rounded-3xl p-10 flex items-center gap-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary-container/40 to-transparent" />
        <div className="w-20 h-20 rounded-full bg-on-primary/20 flex items-center justify-center text-on-primary font-newsreader text-display-xs flex-shrink-0 relative z-10">
          {initials}
        </div>
        <div className="relative z-10">
          <h2 className="text-display-xs font-newsreader text-on-primary mb-1">{currentUser?.name}</h2>
          <p className="text-body-md font-manrope text-on-primary/70">{currentUser?.email}</p>
          <div className="flex gap-3 mt-4">
            <span className="px-3 py-1 bg-on-primary/15 text-on-primary text-label-sm font-manrope font-bold rounded-full">
              {currentUser?.role}
            </span>
            <span className="px-3 py-1 bg-on-primary/15 text-on-primary text-label-sm font-manrope font-bold rounded-full">
              {currentUser?.tier}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-surface-container-low rounded-2xl p-5 text-center">
            <p className="text-display-xs font-newsreader text-primary">{value}</p>
            <p className="text-label-sm font-manrope text-on-surface-variant mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        <h3 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-5">Admin Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/admin/inventory', label: 'Manage Inventory', desc: 'Add, edit, or remove volumes' },
            { href: '/admin/members', label: 'Manage Members', desc: 'View and update patron status' },
            { href: '/admin/onboarding', label: 'Register Curator', desc: 'Issue new staff credentials' },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href} className="bg-surface rounded-xl p-5 hover:bg-surface-container transition-colors group">
              <p className="font-newsreader text-title-md text-on-surface group-hover:text-primary transition-colors">{label}</p>
              <p className="font-manrope text-body-sm text-on-surface-variant mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Account details */}
      <div className="bg-surface-container-low rounded-2xl p-8">
        <h3 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-5">Account Details</h3>
        <dl className="grid grid-cols-2 gap-5">
          {[
            { label: 'Staff ID', value: currentUser?.id },
            { label: 'Role', value: currentUser?.role },
            { label: 'Email', value: currentUser?.email },
            { label: 'Status', value: currentUser?.status },
            { label: 'Tier', value: currentUser?.tier },
            { label: 'Member Since', value: currentUser?.joined },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-label-sm font-manrope text-on-surface-variant mb-1">{label}</dt>
              <dd className="text-body-md font-manrope text-on-surface font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
