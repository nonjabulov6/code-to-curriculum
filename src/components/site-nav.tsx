import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/courses", label: "Courses" },
  { to: "/learning-hub", label: "Learning Hub" },
  { to: "/resources", label: "Resources" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
  { to: "/survey", label: "Student Survey" },
] as const;

export function SiteNav() {
  const { user, isAdmin, isFacilitator, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-hero-gradient text-primary-foreground shadow-elegant">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>LearnHub <span className="text-primary">Tech</span></span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {publicLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "text-primary bg-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link to="/dashboard" className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent" activeProps={{ className: "text-primary bg-accent" }}>
              Dashboard
            </Link>
          )}
          {isFacilitator && !isAdmin && (
            <Link to="/facilitator" className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent" activeProps={{ className: "text-primary bg-accent" }}>
              Facilitator
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent" activeProps={{ className: "text-primary bg-accent" }}>
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? null : user ? (
            <>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground">Profile</Link>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/auth">Sign in</Link></Button>
              <Button size="sm" asChild><Link to="/auth" search={{ mode: "signup" }}>Get started</Link></Button>
            </>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="flex flex-col p-4">
            {publicLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">{l.label}</Link>
            ))}
            {user && <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">Dashboard</Link>}
            {isFacilitator && !isAdmin && <Link to="/facilitator" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">Facilitator</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">Admin</Link>}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm">Profile</Link>
                <Button variant="outline" size="sm" onClick={signOut} className="mt-2">Sign out</Button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1"><Link to="/auth" onClick={() => setOpen(false)}>Sign in</Link></Button>
                <Button size="sm" asChild className="flex-1"><Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)}>Sign up</Link></Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
