"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { useStore } from "@/app/store/useStore";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'Member';
  
  const supabase = createClient();
  const addToast = useStore(s => s.addToast);
  const addLog = useStore(s => s.addLog);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Sync with Store
      const { user } = data;
      if (user) {
        useStore.getState().setUser({
          id: user.id,
          name: user.user_metadata.full_name || 'Archival User',
          email: user.email || '',
          role: user.user_metadata.role || 'Member',
          tier: user.user_metadata.tier || 'User',
          status: 'Active',
          joined: new Date().getFullYear().toString(),
          borrowedBooks: [],
          reservations: [],
          collections: []
        });
      }

      addToast(`Access granted. Welcome to the portal.`, "success");
      addLog("Login", `${email} authenticated via ${role} portal`);
      
      router.push(role === 'Admin' ? '/admin' : '/member/dashboard');
    } catch (err: any) {
      setError(err.message || "Authentication failed. Verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const isMember = role === 'Member';

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 md:p-12 transition-colors duration-1000">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[150px] -ml-[20vw] -mt-[20vw]" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[150px] -mr-[20vw] -mb-[20vw]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-surface-container-lowest/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-outline-variant/30 overflow-hidden flex flex-col lg:flex-row h-full min-h-[700px] relative z-10"
      >
        {/* Form Side */}
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-14">
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-manrope font-bold hover:gap-4 transition-all mb-10 group">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Library Directory
            </Link>
            <h1 className="text-display-sm font-newsreader text-primary mb-3">Log In</h1>
            <p className="text-body-lg font-manrope text-on-surface-variant max-w-sm">Welcome back. Please enter your details to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-[0.2em] pl-1">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-container px-8 py-5 rounded-2xl outline-none font-manrope text-on-surface border border-outline-variant/50 focus:border-primary transition-all hover:bg-surface-container-high shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1 pr-4">
                <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-label-xs font-manrope text-primary hover:underline">Forgot?</button>
              </div>
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
              {loading ? "Signing In..." : "Log In"}
            </button>
          </form>

          <div className="mt-14">
            <p className="text-center text-label-md font-manrope text-on-surface-variant">
              New applicant?{" "}
              <Link 
                href={isMember ? "/signup/member" : "/signup/admin"} 
                className="text-primary font-bold hover:underline"
              >
                {isMember ? "Sign up as Scholar" : "Sign up as Curator"}
              </Link>
            </p>
          </div>
        </div>

        {/* Visual Side */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-surface-container-low border-l border-outline-variant/20 order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl group transition-all">
             <Image 
               src={isMember ? "/assets/scholar_library_redesign.png" : "/assets/light_vault_archival.png"} 
               alt="Lexicon Gateway" 
               fill
               priority
               sizes="(max-width: 768px) 100vw, 50vw"
               className="object-cover transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-primary/5 mix-blend-multiply opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-80" />
             
             <div className="absolute bottom-12 left-12 right-12">
                <p className="text-label-sm font-manrope font-bold uppercase tracking-[0.3em] mb-3 text-primary opacity-80">Library Access</p>
                <h3 className="text-headline-lg font-newsreader text-primary leading-tight mb-2">
                  {role} Login
                </h3>
                <div className="h-1 w-12 bg-primary rounded-full" />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center font-newsreader text-title-lg">Loading Protocol...</div>}>
      <LoginContent />
    </Suspense>
  );
}
