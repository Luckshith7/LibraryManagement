"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupSelectionPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-primary/20">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-display-md font-newsreader text-primary mb-4 leading-tight">Create Your Account</h1>
            <p className="max-w-2xl mx-auto text-body-lg font-manrope text-on-surface-variant">
              Welcome to the archives. Choose your account type to get started.
            </p>
          </motion.div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Member Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/signup/member" className="group block h-full">
              <div className="h-full bg-surface-container-low rounded-[3rem] p-10 lg:p-14 border border-outline-variant/30 hover:border-secondary/50 transition-all hover:bg-surface-container-high shadow-xl hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden group-hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-2 bg-secondary/20 group-hover:bg-secondary transition-colors" />
                
                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-10 group-hover:scale-110 transition-transform">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                
                <h2 className="text-headline-md font-newsreader text-secondary mb-4">Member Account</h2>
                <p className="text-body-md font-manrope text-on-surface-variant mb-12 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  Standard access for researchers and readers. Explore the collection, borrow books, and manage your lists.
                </p>
                
                <div className="w-full py-5 border-2 border-secondary/20 text-secondary rounded-2xl font-manrope font-bold group-hover:bg-secondary group-hover:text-on-secondary transition-all text-label-lg tracking-wide">
                  Sign Up as Member
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/signup/admin" className="group block h-full">
              <div className="h-full bg-primary/5 rounded-[3rem] p-10 lg:p-14 border border-primary/20 hover:border-primary/50 transition-all hover:bg-primary/10 shadow-xl hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden group-hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
                
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                <h2 className="text-headline-md font-newsreader text-primary mb-4">Admin Account</h2>
                <p className="text-body-md font-manrope text-on-surface-variant mb-12 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  Full control for library staff. Manage book inventory, oversaw memberships, and curate the archival records.
                </p>
                
                <div className="w-full py-5 bg-primary text-on-primary rounded-2xl font-manrope font-bold group-hover:bg-primary-container group-hover:text-on-primary-container transition-all text-label-lg tracking-wide shadow-lg shadow-primary/10">
                  Sign Up as Admin
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <footer className="mt-24 text-center">
          <p className="text-body-md font-manrope text-on-surface-variant">
            Returning user?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-8">Log in instead</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
