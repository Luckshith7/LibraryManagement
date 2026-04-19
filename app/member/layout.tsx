"use client";

import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useStore(s => s.currentUser);
  const logout = useStore(s => s.logout);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: "/member/dashboard", label: "Home" },
    { href: "/member/catalog", label: "Browse Books" },
    { href: "/member/collections", label: "My Collections" },
    { href: "/member/reservation", label: "Reading Room" },
  ];

  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'M';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Simple Top Navbar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/member/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">L</div>
              <span className="font-newsreader text-headline-sm text-primary transition-colors group-hover:text-primary-container">Lexicon</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-label-lg font-manrope font-bold transition-all decoration-2 underline-offset-8 ${
                    pathname === item.href 
                      ? 'text-primary underline' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-label-sm font-manrope text-on-surface-variant font-bold uppercase tracking-widest">{currentUser?.tier || 'Scholar'}</span>
               <span className="text-title-sm font-manrope text-on-surface">{currentUser?.name || 'Member'}</span>
            </div>
            
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-lg hover:shadow-primary/20 transition-all">
                {initials}
              </button>
              
              {/* Profile Dropdown (Simplified) */}
              <div className="absolute right-0 mt-3 w-48 bg-surface-container-highest rounded-2xl shadow-2xl border border-outline-variant/30 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -translate-y-2 group-hover:translate-y-0 z-50">
                 <Link href="/member/profile" className="block px-6 py-2.5 text-label-md font-manrope text-on-surface hover:bg-surface-container transition-colors">Profile Details</Link>
                 <Link href="/member/settings" className="block px-6 py-2.5 text-label-md font-manrope text-on-surface hover:bg-surface-container transition-colors">Settings</Link>
                 <div className="h-px bg-on-surface-variant/10 my-1 mx-4" />
                 <button 
                   onClick={handleLogout}
                   className="w-full text-left px-6 py-2.5 text-label-md font-manrope text-error hover:bg-error-container/20 transition-colors"
                 >
                   Log Out
                 </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
        {children}
      </main>

      {/* Mobile Nav (Floating at bottom for convenience) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 bg-surface/95 backdrop-blur-lg rounded-2xl p-4 flex justify-around items-center shadow-xl border border-outline-variant/30">
         {navItems.map(item => (
           <Link key={item.href} href={item.href} className={`transition-all ${pathname === item.href ? 'scale-110 text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              {item.label === 'Home' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>}
              {item.label === 'Browse Books' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>}
              {item.label === 'My Collections' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>}
              {item.label === 'Reading Room' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>}
           </Link>
         ))}
      </nav>
    </div>
  );
}
