"use client";

import React from "react";
import SeedSupabase from "./seed-supabase";

export default function AdminSettings() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-display-md font-newsreader text-primary mb-2">Institutional Settings</h1>
        <p className="text-body-lg font-manrope text-on-surface-variant">Configure archival protocols and system security.</p>
      </header>

      <div className="max-w-3xl space-y-8">
        <section className="bg-surface-container-low rounded-[2rem] p-10 border border-outline-variant/30 space-y-6">
          <h2 className="text-headline-sm font-newsreader text-primary font-medium">Archival Protocols</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/10">
               <div>
                 <p className="text-title-sm font-manrope font-bold text-on-surface">Auto-Reserve Cleanup</p>
                 <p className="text-body-sm font-manrope text-on-surface-variant">Release reservations after 48 hours of inactivity.</p>
               </div>
               <div className="w-12 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-on-primary rounded-full" /></div>
             </div>
             <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/10 opacity-50">
               <div>
                 <p className="text-title-sm font-manrope font-bold text-on-surface">Digitization Pipeline</p>
                 <p className="text-body-sm font-manrope text-on-surface-variant">Automatic OCR for new archival intakes.</p>
               </div>
               <div className="w-12 h-6 bg-outline-variant/30 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant rounded-full" /></div>
             </div>
          </div>
        </section>

        <SeedSupabase />

        <section className="bg-surface-container-low rounded-[2rem] p-10 border border-outline-variant/30 space-y-6">
          <h2 className="text-headline-sm font-newsreader text-primary font-medium">Access Control</h2>
          <div className="space-y-4">
             <button className="w-full text-left p-4 bg-surface rounded-2xl border border-outline-variant/10 text-on-surface font-manrope font-bold flex justify-between items-center group hover:border-primary/50 transition-all">
                Manage Security Keys
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
             <button className="w-full text-left p-4 bg-surface rounded-2xl border border-outline-variant/10 text-on-surface font-manrope font-bold flex justify-between items-center group hover:border-primary/50 transition-all">
                Regional Access Rights
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>
        </section>
      </div>
    </div>
  );
}
