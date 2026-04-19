"use client";

import React from "react";
import { useStore } from "@/app/store/useStore";
import Link from "next/link";

export default function MemberProfile() {
  const currentUser = useStore(s => s.currentUser);
  const books = useStore(s => s.books);
  const reservations = useStore(s => s.reservations).filter(r => r.userId === currentUser?.id);

  const borrowedBooks = books.filter(b => currentUser?.borrowedBooks?.includes(b.id));
  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'M';

  return (
    <div className="max-w-4xl space-y-10">
      <h1 className="text-display-sm font-newsreader text-primary">My Profile</h1>

      {/* Identity Card */}
      <div className="bg-primary rounded-3xl p-10 flex items-center gap-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary-container/40 to-transparent" />
        <div className="w-20 h-20 rounded-full bg-on-primary/20 flex items-center justify-center text-on-primary font-newsreader text-display-xs flex-shrink-0 relative z-10">
          {initials}
        </div>
        <div className="relative z-10">
          <h2 className="text-display-xs font-newsreader text-on-primary mb-1">{currentUser?.name}</h2>
          <p className="text-body-md font-manrope text-on-primary/70">{currentUser?.email}</p>
          <div className="flex gap-4 mt-4">
            <span className="px-3 py-1 bg-on-primary/15 text-on-primary text-label-sm font-manrope font-bold rounded-full">
              {currentUser?.tier} Tier
            </span>
            <span className="px-3 py-1 bg-on-primary/15 text-on-primary text-label-sm font-manrope font-bold rounded-full">
              Since {currentUser?.joined}
            </span>
            <span className={`px-3 py-1 text-label-sm font-manrope font-bold rounded-full ${
              currentUser?.status === 'Active'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-error-container text-on-error-container'
            }`}>
              {currentUser?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Books Borrowed', value: borrowedBooks.length, icon: '📚' },
          { label: 'Reservations', value: reservations.length, icon: '📅' },
          { label: 'Collections', value: currentUser?.collections?.length || 0, icon: '🗂️' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-surface-container-low rounded-2xl p-6 text-center">
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-display-xs font-newsreader text-primary">{value}</p>
            <p className="text-label-md font-manrope text-on-surface-variant mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Currently Borrowed */}
      {borrowedBooks.length > 0 && (
        <section className="bg-surface-container-low rounded-2xl p-8">
          <h3 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-5">Currently Out</h3>
          <div className="space-y-3">
            {borrowedBooks.map(book => (
              <Link key={book.id} href={`/member/book/${book.id}`} className="flex items-center gap-4 hover:bg-surface-container p-3 rounded-xl transition-colors group">
                <div className="w-8 h-11 bg-primary-container rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-newsreader text-body-lg text-on-surface group-hover:text-primary truncate transition-colors">{book.title}</p>
                  <p className="font-manrope text-label-sm text-on-surface-variant">{book.author}</p>
                </div>
                <svg className="w-4 h-4 text-on-surface-variant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Account Info */}
      <section className="bg-surface-container-low rounded-2xl p-8">
        <h3 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-5">Account Details</h3>
        <dl className="grid grid-cols-2 gap-y-5">
          {[
            { label: 'Member ID', value: currentUser?.id },
            { label: 'Role', value: currentUser?.role },
            { label: 'Email', value: currentUser?.email },
            { label: 'Member Since', value: currentUser?.joined },
            { label: 'Tier', value: currentUser?.tier },
            { label: 'Account Status', value: currentUser?.status },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-label-sm font-manrope text-on-surface-variant mb-1">{label}</dt>
              <dd className="text-body-md font-manrope text-on-surface font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
