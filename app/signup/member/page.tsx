"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { useStore } from "@/app/store/useStore";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function MemberSignupPage() {
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
            role: 'Member',
            tier: 'Scholar',
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
          role: 'Member',
          tier: 'Scholar',
          status: 'Active',
          joined: new Date().getFullYear().toString(),
          borrowedBooks: [],
          reservations: [],
          collections: []
        });
      }

      addToast("Account created successfully. Welcome!", "success");
      addLog("User Management", `New Scholar account registered for ${name}`);
      router.push('/member/dashboard');
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-secondary/20">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[150px] -mr-[25vw] -mt-[25vw]" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] -ml-[20vw] -mb-[20vw]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-surface-container-lowest/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-outline-variant/30 overflow-hidden flex flex-col lg:flex-row-reverse h-full min-h-[750px] relative z-10"
      >
        {/* Visual Side: The Library */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-surface-container-low border-l border-outline-variant/20">
          <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl soft-ui-shadow group">
             <Image 
               src="/assets/scholar_library_redesign.png" 
               alt="Grand Library" 
               fill
               sizes="(max-width: 768px) 100vw, 50vw"
               className="object-cover transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply opacity-40 group-hover:opacity-20 transition-opacity" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
             
             <div className="absolute bottom-12 left-12 right-12 text-white">
                <p className="text-label-md font-manrope font-bold uppercase tracking-[0.3em] mb-3 opacity-90">Institutional Intake</p>
                <h3 className="text-headline-lg font-newsreader leading-tight mb-4">Scholarly Appointment</h3>
                <div className="flex items-center gap-4 text-body-md font-manrope opacity-90">
                   <span className="w-8 h-px bg-white/40" />
                   <span>"Knowledge is the architect of the future."</span>
                </div>
             </div>

             {/* Dust/Light micro-animation particles overlay could go here */}
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-14 text-center lg:text-left">
            <Link href="/signup" className="inline-flex items-center gap-2 text-secondary font-manrope font-bold hover:gap-4 transition-all mb-10 group">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Archives Directory
            </Link>
            <h1 className="text-display-md font-newsreader text-primary mb-3">Create Account</h1>
            <p className="text-body-lg font-manrope text-on-surface-variant max-w-sm">Create your library account to start borrowing books and exploring the collection.</p>
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
                className="w-full bg-surface-container px-8 py-5 rounded-2xl outline-none font-manrope text-on-surface border border-outline-variant/50 focus:border-secondary transition-all hover:bg-surface-container-high shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-[0.2em] pl-1">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-container px-8 py-5 rounded-2xl outline-none font-manrope text-on-surface border border-outline-variant/50 focus:border-secondary transition-all hover:bg-surface-container-high shadow-sm"
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
                className="w-full bg-surface-container px-8 py-5 rounded-2xl outline-none font-manrope text-on-surface border border-outline-variant/50 focus:border-secondary transition-all hover:bg-surface-container-high shadow-sm"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-error-container/30 border border-error-container p-4 rounded-xl"
                >
                  <p className="text-error text-label-sm font-manrope font-bold text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-6 bg-secondary text-on-secondary rounded-2xl font-manrope font-bold tracking-[0.1em] text-label-lg transition-all shadow-[0_20px_40px_rgba(45,106,79,0.1)] hover:shadow-secondary/20 active:scale-[0.98] mt-8 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-14 text-center text-label-sm font-manrope text-on-surface-variant/40 uppercase tracking-[0.2em]">
            Lexicon Community Library // Open Access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
