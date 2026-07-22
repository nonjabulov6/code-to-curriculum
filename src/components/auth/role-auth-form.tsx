import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { BookOpen, Users } from "lucide-react";

export type AuthRole = "student" | "facilitator";

interface Props {
  role: AuthRole;
  title: string;
  subtitle: string;
  accent: "learner" | "facilitator";
}

export function RoleAuthForm({ role, title, subtitle, accent }: Props) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const pending = sessionStorage.getItem("pending_role");
      if (pending === "facilitator") {
        sessionStorage.removeItem("pending_role");
        await supabase.from("user_roles").insert({ user_id: data.session.user.id, role: "facilitator" });
      }
      navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Account created — welcome ${role === "facilitator" ? "facilitator" : "learner"}!`);
    navigate({ to: "/dashboard" });
  }

  async function signInGoogle() {
    if (tab === "signup" && role === "facilitator") sessionStorage.setItem("pending_role", role);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); return; }
    if (result.redirected) return;
    if (tab === "signup" && role === "facilitator") {
      const { data } = await supabase.auth.getSession();
      if (data.session) await supabase.from("user_roles").insert({ user_id: data.session.user.id, role: "facilitator" });
    }
    sessionStorage.removeItem("pending_role");
    navigate({ to: "/dashboard" });
  }

  const Icon = accent === "learner" ? BookOpen : Users;
  const otherRoleHref = accent === "learner" ? "/auth/facilitator" : "/auth/learner";
  const otherRoleLabel = accent === "learner" ? "Sign up as a Facilitator instead" : "Sign up as a Learner instead";

  return (
    <PageShell>
      <section className="grid min-h-[80vh] place-items-center bg-subtle-gradient px-4 py-16">
        <Card className="w-full max-w-md p-8 shadow-elegant">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-hero-gradient text-primary-foreground shadow-elegant">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={signInGoogle}>
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.6l3-3C17.2 1.9 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.3l3.5 2.7C6.1 7.1 8.8 5 12 5z"/><path fill="#4285F4" d="M23 12c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.5-1.1 2.7-2.4 3.5l3.7 2.9C21.6 18.5 23 15.5 23 12z"/><path fill="#FBBC05" d="M5.1 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L1.6 7.3C.6 9.1 0 11 0 12s.6 2.9 1.6 4.7l3.5-2.7z"/><path fill="#34A853" d="M12 23c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.3 1.1-4.2 1.1-3.2 0-5.9-2.1-6.9-5l-3.5 2.7C3.5 20.4 7.4 23 12 23z"/></svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign up</TabsTrigger>
              <TabsTrigger value="signin">Sign in</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4">
                <div><Label htmlFor="name">Full name</Label><Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                <div><Label htmlFor="email-up">Email</Label><Input id="email-up" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
                <div><Label htmlFor="pw-up">Password</Label><Input id="pw-up" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" /><p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account…" : `Create ${role === "facilitator" ? "Facilitator" : "Learner"} account`}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4">
                <div><Label htmlFor="email-in">Email</Label><Input id="email-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
                <div><Label htmlFor="pw-in">Password</Label><Input id="pw-in" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
            <Link to={otherRoleHref} className="block underline">{otherRoleLabel}</Link>
            <Link to="/auth" className="block hover:underline">← Back to role selection</Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
