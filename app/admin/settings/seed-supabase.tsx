"use client";

import React, { useState } from "react";
import { useStore } from "@/app/store/useStore";
import { createClient } from "@/app/lib/supabase/client";

export default function SeedSupabase() {
  const { books, addToast } = useStore();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    const confirmSeed = window.confirm(
      "This will push your current local mock-data volumes to the Supabase online database. Proceed?"
    );
    if (!confirmSeed) return;

    setIsSeeding(true);
    const supabase = createClient();

    try {
      // 1. Check if the table exists and if we have keys
      const { error: testError } = await supabase
        .from('books')
        .select('id')
        .limit(1);

      if (testError) {
        if (testError.message === 'Fetch argument YOUR_SUPABASE_URL is not a valid URL.') {
          addToast("Supabase keys are missing in .env.local", "error");
        } else {
          addToast(`Connection error: ${testError.message}`, "error");
        }
        return;
      }

      // 2. Prepare data (remove local IDs if they are not UUIDs, or keep them if they are)
      // Supabase table uses UUID, our local IDs might be numeric strings.
      const booksToSeed = books.map((book) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = book;
        return {
          ...rest,
          tags: book.tags || []
        };
      });

      // 3. Upsert data
      const { error: seedError } = await supabase
        .from('books')
        .insert(booksToSeed);

      if (seedError) {
        addToast(`Archival sync failed: ${seedError.message}`, "error");
      } else {
        addToast(`Successfully cataloged ${booksToSeed.length} volumes in the online archive.`, "success");
      }
    } catch (err) {
      console.error(err);
      addToast("An unexpected error occurred during archival seeding.", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <section className="bg-primary-container/10 rounded-[2rem] p-10 border border-primary/20 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-headline-sm font-newsreader text-primary font-medium">Database Archival Sync</h2>
          <p className="text-body-md font-manrope text-on-surface-variant">
            Migrate current local collections to the online Supabase repository.
          </p>
        </div>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-label-sm font-bold uppercase tracking-wider">
          Experimental
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/10 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <p className="text-title-sm font-manrope font-bold text-on-surface">Online Repository Migration</p>
            <p className="text-body-sm font-manrope text-on-surface-variant">
              This will upload <strong>{books.length}</strong> catalog entries to your current Supabase project.
            </p>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={isSeeding}
          className={`w-full py-4 rounded-xl font-manrope font-bold text-label-lg transition-all flex items-center justify-center gap-2 ${
            isSeeding 
            ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' 
            : 'bg-primary text-on-primary hover:bg-primary-container shadow-md hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {isSeeding ? (
            <>
              <div className="w-4 h-4 border-2 border-on-surface-variant border-t-transparent rounded-full animate-spin" />
              Synchronizing Archives...
            </>
          ) : (
            "Initiate Archival Sync"
          )}
        </button>
      </div>

      <p className="text-label-xs font-manrope text-on-surface-variant italic">
        * Ensure your books table schema matches the archival protocol before initiation.
      </p>
    </section>
  );
}
