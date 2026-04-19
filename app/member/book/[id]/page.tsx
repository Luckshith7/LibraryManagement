"use client";

import React from "react";
import { useStore } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const books = useStore(s => s.books);
  const currentUser = useStore(s => s.currentUser);
  const borrowBook = useStore(s => s.borrowBook);
  const returnBook = useStore(s => s.returnBook);
  const reserveBook = useStore(s => s.reserveBook);
  const router = useRouter();

  const book = books.find(b => b.id === id);

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="text-display-sm font-newsreader text-primary mb-4">Volume Not Found</h1>
        <p className="text-body-lg font-manrope text-on-surface-variant mb-8">This record does not exist in the catalog.</p>
        <Link href="/member/catalog" className="px-6 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isBorrowed = currentUser?.borrowedBooks?.includes(book.id);

  const statusColors: Record<string, string> = {
    Available: 'bg-secondary-container text-on-secondary-container',
    Borrowed: 'bg-surface-container-high text-on-surface-variant',
    Reserved: 'bg-primary-container/30 text-primary',
    Missing: 'bg-error-container text-on-error-container',
  };

  return (
    <div className="max-w-6xl">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-label-md font-manrope text-on-surface-variant hover:text-on-surface transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cover & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Cover */}
            <div className="w-full aspect-[2/3] bg-gradient-to-br from-primary-container to-primary rounded-2xl shadow-[0_24px_48px_rgba(1,45,29,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
              {book.coverImage ? (
                <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-on-primary" />
                    <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-on-primary" />
                  </div>
                  <div className="p-8 text-center relative z-10">
                    <p className="font-newsreader text-on-primary/90 text-title-lg leading-snug">{book.title}</p>
                    <p className="font-manrope text-on-primary/60 text-label-md mt-4">{book.author}</p>
                  </div>
                </>
              )}
            </div>

            {/* Call number */}
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <p className="text-label-xs font-manrope text-on-surface-variant uppercase tracking-widest mb-1">Call Number</p>
              <p className="font-manrope font-bold text-on-surface">{book.callNumber}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isBorrowed ? (
                <button
                  onClick={() => returnBook(book.id)}
                  className="w-full py-3.5 bg-surface-container-high text-on-surface font-manrope font-bold rounded-xl hover:bg-surface-container transition-colors"
                >
                  Return This Book
                </button>
              ) : book.status === 'Available' ? (
                <>
                  <button
                    onClick={() => borrowBook(book.id)}
                    className="w-full py-3.5 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors"
                  >
                    Borrow This Volume
                  </button>
                  <button
                    onClick={() => reserveBook(book.id)}
                    className="w-full py-3.5 bg-surface-container text-on-surface font-manrope font-bold rounded-xl hover:bg-surface-container-high transition-colors"
                  >
                    Reserve for Reading Room
                  </button>
                </>
              ) : (
                <div className="w-full py-3.5 bg-surface-container rounded-xl text-center">
                  <p className="font-manrope font-bold text-on-surface-variant">Not Available</p>
                  <p className="font-manrope text-label-sm text-on-surface-variant/60 mt-1">Currently {book.status.toLowerCase()}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {book.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container text-on-surface-variant text-label-sm font-manrope rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-manrope font-bold mb-4 ${statusColors[book.status]}`}>
              {book.status}
            </span>
            <h1 className="text-display-sm font-newsreader text-primary leading-tight mb-3">{book.title}</h1>
            <p className="text-headline-xs font-manrope text-on-surface-variant">{book.author}</p>
          </div>

          {/* Synopsis */}
          <section>
            <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-4">Synopsis</h2>
            <p className="text-body-lg font-manrope text-on-surface leading-relaxed">{book.synopsis}</p>
          </section>

          {/* Publication Details */}
          <section className="bg-surface-container-low rounded-2xl p-8">
            <h3 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-6">Publication Details</h3>
            <dl className="grid grid-cols-2 gap-6">
              {[
                { label: 'Author', value: book.author },
                { label: 'Year', value: book.year },
                { label: 'Publisher', value: book.publisher },
                { label: 'Pages', value: `${book.pages} pages` },
                { label: 'ISBN', value: book.isbn },
                { label: 'Call Number', value: book.callNumber },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-label-sm font-manrope text-on-surface-variant mb-1">{label}</dt>
                  <dd className="text-body-md font-manrope text-on-surface font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
