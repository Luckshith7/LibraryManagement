"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { useStore } from "@/app/store/useStore";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  const addToast = useStore(s => s.addToast);
  const addLog = useStore(s => s.addLog);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'Admin',
            tier: 'Curator',
          }
        }
      });

      if (signUpError) throw signUpError;

      // Sync with Store
      const { user } = data;
      if (user) {
        useStore.getState().setUser({
          id: user.id,
          name: user.user_metadata.full_name || 'Archival User',
          email: user.email || '',
          role: 'Admin',
          tier: 'Curator',
          status: 'Active',
          joined: new Date().getFullYear().toString(),
          borrowedBooks: [],
          reservations: [],
          collections: []
        });
      }

      addToast("Account created successfully. Welcome!", "success");
      addLog("User Management", `New Admin account created for ${name}`);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-primary/10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] -mr-[25vw] -mt-[25vw]" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[120px] -ml-[20vw] -mb-[20vw]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-surface-container-lowest/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-outline-variant/30 overflow-hidden flex flex-col lg:flex-row h-full min-h-[750px] relative z-10"
      >
        {/* Form Side */}
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-14">
            <Link href="/signup" className="inline-flex items-center gap-2 text-primary font-manrope font-bold hover:gap-4 transition-all mb-10 group">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Archives Directory
            </Link>
            <h1 className="text-display-md font-newsreader text-primary mb-3">Create Librarian Account</h1>
            <p className="text-body-lg font-manrope text-on-surface-variant max-w-sm">Manage books and library members in our community repository.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-[0.2em] pl-1">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-surface-container px-8 py-5 rounded-2xl outline-none font-manrope text-on-surface border border-outline-variant/50 focus:border-primary transition-all hover:bg-surface-container-high shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-[0.2em] pl-1">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-surface-container px-8 py-5 rounded-2xl outline-none font-manrope text-on-surface border border-outline-variant/50 focus:border-primary transition-all hover:bg-surface-container-high shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-[0.2em] pl-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container px-8 py-5 rounded-2xl outline-none font-manrope text-on-surface border border-outline-variant/50 focus:border-primary transition-all hover:bg-surface-container-high shadow-sm"
              />
            </div>


            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-error-container/30 border border-error-container p-4 rounded-xl"
                >
                  <p className="text-error text-label-sm font-manrope font-bold text-center uppercase tracking-wider">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-6 bg-primary text-on-primary rounded-2xl font-manrope font-bold tracking-[0.2em] text-label-lg transition-all shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] mt-8 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-14 text-center text-label-sm font-manrope text-on-surface-variant/30 uppercase tracking-[0.2em]">
            Community Library Management // Open Archive
          </p>
        </div>

        {/* Visual Side: The Archive (Light) */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-surface-container-low border-l border-outline-variant/20 order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl soft-ui-shadow group">
             <Image 
               src="/assets/light_vault_archival.png" 
               alt="Light Archival Room" 
               fill
               priority
               sizes="(max-width: 768px) 100vw, 50vw"
               className="object-cover transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-primary/5 mix-blend-multiply opacity-40 group-hover:opacity-20 transition-opacity" />
             <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-80" />
             
             {/* Info Overlay */}
             <div className="absolute bottom-12 left-12 right-12">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                   <span className="text-label-xs font-manrope font-bold text-primary uppercase tracking-[0.3em]">System Online</span>
                </div>
                <h3 className="text-headline-lg font-newsreader text-primary leading-tight mb-2">Inventory Management</h3>
                <p className="text-body-md font-manrope text-on-surface-variant/80">"Structure defines the accessibility of truth."</p>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
