import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isFacilitator: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true, isAdmin: false });

  useEffect(() => {
    let mounted = true;

    async function checkRole(userId: string | undefined) {
      if (!userId) return false;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      return !!data;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const isAdmin = await checkRole(data.session?.user.id);
      if (!mounted) return;
      setState({ user: data.session?.user ?? null, session: data.session, loading: false, isAdmin });
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const isAdmin = await checkRole(session?.user.id);
      if (!mounted) return;
      setState({ user: session?.user ?? null, session, loading: false, isAdmin });
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}
