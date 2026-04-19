"use client";

import React, { useState, useMemo, useEffect } from "react";
import BookCard from "@/app/(components)/BookCard";
import { useStore, Book } from "@/app/store/useStore";
import { createClient } from "@/app/lib/supabase/client";

const TAGS = ['All', 'Architecture', 'Design', 'Typography', 'History', 'Art', 'Theory', 'Psychology'];

export default function CatalogPage() {
  const { books, setBooks, isLoading, setIsLoading, addToast } = useStore();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      // If we already have books (more than the initial ones or already hydrated), 
      // we might want to skip, but for now we always fetch to be fresh.
      setIsLoading(true);
      const supabase = createClient();
      
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('title', { ascending: true });

        if (error) {
          console.error('Error fetching books:', error);
          // If the error is likely due to missing environment variables, we don't toast
          // unless it's a real database error.
          if (error.message !== 'Fetch argument YOUR_SUPABASE_URL is not a valid URL.') {
             addToast('Archival catalog connection failed.', 'error');
          }
        } else if (data && data.length > 0) {
          setBooks(data as Book[]);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [setBooks, setIsLoading, addToast]);

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchesQuery = !query ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.callNumber.toLowerCase().includes(query.toLowerCase());
      const matchesTag = activeTag === 'All' || (b.tags && b.tags.includes(activeTag));
      return matchesQuery && matchesTag;
    });
  }, [books, query, activeTag]);

  return (
    <div className="space-y-10 max-w-7xl">
      <div>
        <h1 className="text-display-sm font-newsreader text-primary mb-2">Library Catalog</h1>
        <p className="text-body-md font-manrope text-on-surface-variant">
          {books.length} volumes in the archival collection.
        </p>
      </div>

      {/* Search */}
      <div className="w-full bg-surface-container rounded-2xl px-6 py-4 flex items-center gap-4 focus-within:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 transition-all">
        <svg className="h-5 w-5 text-on-surface-variant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, author, or call number..."
          className="bg-transparent border-none outline-none flex-1 text-body-lg font-manrope text-on-surface placeholder:text-on-surface-variant/50"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-5 py-2 rounded-full text-label-md font-manrope font-bold transition-all ${
              activeTag === tag
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-body-md font-manrope text-on-surface-variant italic">
            Consulting the digital archives...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-headline-sm font-newsreader text-on-surface-variant mb-2">No volumes found</p>
          <p className="text-body-md font-manrope text-on-surface-variant/60">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => { setQuery(""); setActiveTag("All"); }}
            className="mt-4 text-label-md font-manrope font-bold text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div>
          <p className="text-label-md font-manrope text-on-surface-variant mb-6">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
            {activeTag !== 'All' && ` in ${activeTag}`}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map(book => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
