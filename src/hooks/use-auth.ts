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
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true, isAdmin: false, isFacilitator: false });

  useEffect(() => {
    let mounted = true;

    async function loadRoles(userId: string | undefined) {
      if (!userId) return { isAdmin: false, isFacilitator: false };
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      const roles = (data ?? []).map((r) => r.role);
      return { isAdmin: roles.includes("admin"), isFacilitator: roles.includes("facilitator") };
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const roles = await loadRoles(data.session?.user.id);
      if (!mounted) return;
      setState({ user: data.session?.user ?? null, session: data.session, loading: false, ...roles });
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const roles = await loadRoles(session?.user.id);
      if (!mounted) return;
      setState({ user: session?.user ?? null, session, loading: false, ...roles });
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}
