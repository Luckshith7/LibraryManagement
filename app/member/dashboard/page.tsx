"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/app/store/useStore";
import BookCard from "@/app/(components)/BookCard";
import { motion } from "framer-motion";

export default function MemberDashboard() {
  const currentUser = useStore(s => s.currentUser);
  const books = useStore(s => s.books);

  const borrowedBooks = books.filter(b => currentUser?.borrowedBooks?.includes(b.id));
  const featuredBooks = books.filter(b => b.status === 'Available').slice(0, 5);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-12 text-on-secondary shadow-2xl shadow-secondary/20">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-on-secondary blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-40 w-32 h-32 rounded-full bg-on-secondary blur-2xl" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-label-md font-manrope text-on-secondary/60 uppercase tracking-[0.2em] mb-4">Scholarly Portal</p>
            <h1 className="text-display-md font-newsreader mb-6 leading-tight">
              Greetings, {currentUser?.name?.split(' ')[0] || 'Scholar'}.
            </h1>
            <p className="text-body-lg font-manrope text-on-secondary/80 mb-8">
              Explore our curated selection of archival rarities and historical manuscripts. Your research journey continues here.
            </p>
            <Link 
              href="/member/catalog" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-on-secondary text-secondary rounded-2xl font-manrope font-bold text-label-lg hover:-translate-y-1 transition-all"
            >
              Browse The Catalog
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/30">
          <p className="text-display-xs font-newsreader text-primary mb-1">{borrowedBooks.length}</p>
          <p className="text-label-md font-manrope text-on-surface-variant font-bold uppercase tracking-wider">Active Loans</p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/30">
          <p className="text-display-xs font-newsreader text-primary mb-1">{currentUser?.reservations?.length || 0}</p>
          <p className="text-label-md font-manrope text-on-surface-variant font-bold uppercase tracking-wider">Reservations</p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/30">
          <p className="text-display-xs font-newsreader text-primary mb-1">{currentUser?.collections?.length || 0}</p>
          <p className="text-label-md font-manrope text-on-surface-variant font-bold uppercase tracking-wider">Personal Collections</p>
        </div>
      </div>

      {/* Featured Shelf */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-headline-sm font-newsreader text-primary">Featured Selection</h2>
            <p className="text-body-md font-manrope text-on-surface-variant">Recommended for your recent research areas.</p>
          </div>
          <Link href="/member/catalog" className="text-label-md font-manrope font-bold text-primary hover:underline decoration-2 underline-offset-8 transition-all">View Full Catalog →</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {featuredBooks.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <BookCard {...book} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* My Books Section */}
      <section className="space-y-6">
        <h2 className="text-headline-sm font-newsreader text-primary px-2">My Books</h2>
        {borrowedBooks.length === 0 ? (
          <div className="bg-surface-container-low rounded-[2rem] p-16 text-center border border-dashed border-outline-variant/50">
            <p className="text-title-md font-newsreader text-on-surface-variant mb-2">No active loans found</p>
            <p className="text-body-md font-manrope text-on-surface-variant/60 mb-6">The archives are vast—start your collection today.</p>
            <Link href="/member/catalog" className="text-primary font-bold hover:underline">Explore Titles</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {borrowedBooks.map((book) => (
              <Link href={`/member/book/${book.id}`} key={book.id} className="group block">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-[1.5rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-16 bg-surface-container-high rounded-lg flex items-center justify-center text-primary/40 flex-shrink-0 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                     </div>
                     <div>
                        <h3 className="text-title-lg font-newsreader text-on-surface group-hover:text-primary transition-colors">{book.title}</h3>
                        <p className="text-label-md font-manrope text-on-surface-variant">by {book.author}</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-10">
                     <div className="text-right">
                        <p className="text-label-xs font-manrope text-on-surface-variant uppercase tracking-widest mb-1">Due Date</p>
                        <p className="text-title-sm font-manrope font-bold text-error">May 12, 2026</p>
                     </div>
                     <span className="px-4 py-2 bg-primary/5 text-primary text-label-md font-manrope font-bold rounded-xl group-hover:bg-primary group-hover:text-on-primary transition-all">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
