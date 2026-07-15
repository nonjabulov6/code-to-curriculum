import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — LearnHub Tech" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? "");
    });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, updated_at: new Date().toISOString() }).eq("id", user.id);
    setLoading(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-4xl font-bold">Your profile</h1>
        <Card className="mt-8 p-6 shadow-card">
          <form onSubmit={save} className="space-y-4">
            <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
            <div><Label htmlFor="fn">Full name</Label><Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save changes"}</Button>
          </form>
        </Card>
      </section>
    </PageShell>
  );
}
