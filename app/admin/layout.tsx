"use client";

import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
  )},
  { href: "/admin/inventory", label: "Books", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
    </svg>
  )},
  { href: "/admin/members", label: "Users", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M14.25 5.25a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0zm7.45 14.25a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
    </svg>
  )},
  { href: "/admin/settings", label: "Settings", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.127.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useStore(s => s.currentUser);
  const isAuthLoading = useStore(s => s.isAuthLoading);
  const logout = useStore(s => s.logout);
  const books = useStore(s => s.books);
  const members = useStore(s => s.members);

  React.useEffect(() => {
    if (!isAuthLoading) {
      if (!currentUser) {
        router.push('/login?role=Admin');
      } else if (currentUser.role !== 'Admin') {
        router.push('/member/dashboard');
      }
    }
  }, [currentUser, isAuthLoading, router]);

  if (isAuthLoading || !currentUser || currentUser.role !== 'Admin') {
    return <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant font-manrope font-bold text-label-lg tracking-widest uppercase">Verifying Access...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const availableCount = books.filter(b => b.status === 'Available').length;
  const memberCount = members.filter(m => m.role === 'Member' && m.status === 'Active').length;

  return (
    <div className="flex bg-surface min-h-screen text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant/20 flex-shrink-0 flex flex-col py-8 px-6 sticky top-0 h-screen">
        <Link href="/admin/inventory" className="block mb-10 px-2">
          <h2 className="text-headline-md font-newsreader text-primary leading-none font-bold">Lexicon</h2>
          <p className="text-label-sm font-manrope text-on-surface-variant/70 uppercase tracking-widest mt-1">Admin Portal</p>
        </Link>

        {/* Quick Stats */}
        <div className="flex gap-3 mb-8 px-2">
          <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center border border-primary/10">
            <p className="text-title-md font-newsreader text-primary">{books.length}</p>
            <p className="text-label-xs font-manrope text-on-surface-variant">Volumes</p>
          </div>
          <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center border border-primary/10">
            <p className="text-title-md font-newsreader text-primary">{memberCount}</p>
            <p className="text-label-xs font-manrope text-on-surface-variant">Members</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-lg font-manrope font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/10'
                    : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant/20 pt-4 space-y-1">
          <Link
            href="/admin/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-md font-manrope font-bold transition-all ${
              pathname === '/admin/profile'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {currentUser?.name?.split(' ')[0] || 'Admin'}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-label-md font-manrope font-bold text-on-surface-variant hover:bg-error/5 hover:text-error transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 px-10 py-4 flex justify-between items-center">
          <span className="text-label-md font-manrope text-on-surface-variant">
            {availableCount} volumes available · {memberCount} active members
          </span>
          <Link href="/admin/profile" className="flex items-center gap-2 group">
            <span className="text-label-md font-manrope text-on-surface-variant group-hover:text-on-surface transition-colors">
              {currentUser?.name || 'Head Archivist'}
            </span>
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-manrope font-bold text-label-md shadow-sm">
              A
            </div>
          </Link>
        </header>
        <div className="flex-1 overflow-y-auto px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
