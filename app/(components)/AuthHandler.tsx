"use client";

import { useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useStore } from "@/app/store/useStore";

export default function AuthHandler() {
  const supabase = createClient();
  const setUser = useStore((s) => s.setUser);
  const setIsAuthLoading = useStore((s) => s.setIsAuthLoading);

  useEffect(() => {
    // 1. Initial Check
    const checkSession = async () => {
      setIsAuthLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            name: u.user_metadata.full_name || "Archival User",
            email: u.email || "",
            role: u.user_metadata.role || "Member",
            tier: u.user_metadata.tier || "Scholar",
            status: "Active",
            joined: new Date().getFullYear().toString(),
            borrowedBooks: [],
            reservations: [],
            collections: [],
          });
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkSession();

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            name: u.user_metadata.full_name || "Archival User",
            email: u.email || "",
            role: u.user_metadata.role || "Member",
            tier: u.user_metadata.tier || "Scholar",
            status: "Active",
            joined: new Date().getFullYear().toString(),
            borrowedBooks: [],
            reservations: [],
            collections: [],
          });
        } else {
          const current = useStore.getState().currentUser;
          if (!current || !current.id.startsWith('admin-')) {
            setUser(null);
          }
        }
        setIsAuthLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser]);

  return null;
}
