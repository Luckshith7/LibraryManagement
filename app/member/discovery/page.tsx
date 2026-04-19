"use client";

import React, { useMemo, useState } from "react";
import { useStore } from "@/app/store/useStore";
import BookCard from "@/app/(components)/BookCard";

export default function AdvancedDiscovery() {
  const books = useStore(s => s.books);
  const [query, setQuery] = useState("");
  const [field, setField] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => {
    if (!hasSearched || !query.trim()) return [];
    return books.filter(book => {
      const q = query.toLowerCase();
      const matchesField =
        field === 'all' ? (
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.tags.some(t => t.toLowerCase().includes(q)) ||
          book.callNumber.toLowerCase().includes(q) ||
          book.isbn.includes(q)
        )
        : field === 'author' ? book.author.toLowerCase().includes(q)
        : field === 'title' ? book.title.toLowerCase().includes(q)
        : field === 'subject' ? book.tags.some(t => t.toLowerCase().includes(q))
        : field === 'callnumber' ? book.callNumber.toLowerCase().includes(q)
        : field === 'isbn' ? book.isbn.includes(q)
        : true;

      const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
      return matchesField && matchesStatus;
    });
  }, [books, query, field, statusFilter, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="max-w-6xl space-y-10">
      <div>
        <h1 className="text-display-sm font-newsreader text-primary mb-2">Advanced Discovery</h1>
        <p className="text-body-md font-manrope text-on-surface-variant">
          Precision metadata search across the entire archival collection.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-surface-container-low p-8 rounded-2xl space-y-6">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <label className="block text-label-sm font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-2">Search Query</label>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter search terms..."
                className="w-full bg-surface rounded-xl px-5 py-3 outline-none font-manrope text-body-lg text-on-surface focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all"
            />
          </div>
          <div className="md:w-52">
            <label className="block text-label-sm font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-2">Search Field</label>
            <select
              value={field}
              onChange={e => setField(e.target.value)}
              className="w-full bg-surface rounded-xl px-5 py-3 outline-none font-manrope text-body-md text-on-surface focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 transition-all appearance-none"
            >
              <option value="all">All Fields</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="subject">Subject / Tag</option>
              <option value="callnumber">Call Number</option>
              <option value="isbn">ISBN</option>
            </select>
          </div>
          <div className="md:w-52">
            <label className="block text-label-sm font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-2">Availability</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-surface rounded-xl px-5 py-3 outline-none font-manrope text-body-md text-on-surface focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 transition-all appearance-none"
            >
              <option value="all">Any Status</option>
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors"
          >
            Search Archive
          </button>
        </div>
      </form>

      {hasSearched && (
        <div>
          <p className="text-body-md font-manrope text-on-surface-variant mb-6">
            {results.length === 0 ? 'No results found.' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
          {results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {results.map(book => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          )}
          {results.length === 0 && (
            <div className="py-16 text-center bg-surface-container-low rounded-2xl">
              <p className="font-newsreader text-title-lg text-on-surface-variant mb-2">No matching records</p>
              <p className="font-manrope text-body-md text-on-surface-variant/60">Try a different query or field selection.</p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="font-newsreader text-title-lg text-on-surface-variant">Enter a query to begin discovery</p>
        </div>
      )}
    </div>
  );
}
