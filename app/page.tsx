"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GatewayPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -mr-[25vw] -mt-[25vw]" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[100px] -ml-[20vw] -mb-[20vw]" />

      <div className="max-w-5xl w-full text-center mb-16 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="text-display-lg font-newsreader text-primary mb-4 leading-tight">
            Lexicon Library
          </h1>
          <p className="text-body-lg font-manrope text-on-surface-variant max-w-2xl mx-auto">
            Welcome to your digital library. Browse our curated collection of books and archives, open for everyone to explore and enjoy.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        {/* Admin Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link href="/login?role=Admin" className="group">
            <div className="h-full bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 backdrop-blur-sm relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              
              {/* Image Frame */}
              <div className="w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden relative border-4 border-white shadow-xl soft-ui-shadow">
                 <Image 
                   src="/assets/curator.png" 
                   alt="Archival Vault" 
                   fill
                   priority
                   sizes="(max-width: 768px) 100vw, 33vw"
                   className="object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>

              <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A4.833 4.833 0 0118 9.75c-1.105 0-2.065.372-2.824.998l-3.176-2.541m-6.353 2.541A4.833 4.833 0 016 9.75c1.105 0 2.065.372 2.824.998l3.176-2.541M21 21H3" />
                </svg>
              </div>

              <h2 className="text-headline-md font-newsreader text-primary mb-4">Librarian Access</h2>
              <p className="text-body-md font-manrope text-on-surface-variant leading-relaxed mb-8 flex-1">
                Management portal for library staff. Update the book inventory, manage members, and organize new collections.
              </p>
              
              <div className="flex items-center text-primary font-bold font-manrope gap-2 group-hover:gap-4 transition-all mt-auto">
                Enter as Librarian
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Member Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/login?role=Member" className="group text-left">
            <div className="h-full bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/5 hover:-translate-y-2 backdrop-blur-sm relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors" />

              {/* Image Frame */}
              <div className="w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden relative border-4 border-white shadow-xl soft-ui-shadow">
                 <Image 
                   src="/assets/scholar.png" 
                   alt="Reading Room" 
                   fill
                   priority
                   sizes="(max-width: 768px) 100vw, 33vw"
                   className="object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-secondary/20 mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>

              <div className="w-16 h-16 bg-secondary text-on-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
                </svg>
              </div>

              <h2 className="text-headline-md font-newsreader text-secondary mb-4">Member Reading Room</h2>
              <p className="text-body-md font-manrope text-on-surface-variant leading-relaxed mb-8 flex-1">
                Your personal library dashboard. Browse the full catalog, borrow books, and manage your custom reading lists.
              </p>
              
              <div className="flex items-center text-secondary font-bold font-manrope gap-2 group-hover:gap-4 transition-all mt-auto">
                Enter as Member
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-24 w-full max-w-4xl border-t border-outline-variant/10 pt-12 pb-8 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 px-4">
          <div className="space-y-4">
            <h4 className="text-label-md font-manrope font-bold text-primary uppercase tracking-[0.2em]">Lexicon Library</h4>
            <p className="text-label-sm font-manrope text-on-surface-variant max-w-xs leading-relaxed">
              Open access to knowledge for all members of the community. Preserving the past to inspire the future.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest pl-1">Resources</p>
              <ul className="space-y-2 text-label-sm font-manrope text-on-surface-variant">
                <li><a href="#" className="hover:text-primary transition-colors">Archival Ethics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Usage Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Desk</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest pl-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-label-sm font-manrope text-on-surface-variant">Library Online</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <p className="text-label-xs font-manrope text-on-surface-variant/40 uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Lexicon Library. All Rights Reserved.
          </p>
          <p className="text-label-xs font-manrope text-on-surface-variant/40 uppercase tracking-[0.1em]">
            Built for Knowledge · Open for Everyone
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
