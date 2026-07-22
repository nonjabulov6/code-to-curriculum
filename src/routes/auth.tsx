import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Join LearnHub Tech — Choose your path" },
      { name: "description", content: "Sign in or create an account as a Learner or a Facilitator on LearnHub Tech." },
      { property: "og:title", content: "Join LearnHub Tech" },
      { property: "og:description", content: "Choose Learner or Facilitator to get started on LearnHub Tech." },
    ],
  }),
  component: AuthPicker,
});

function AuthPicker() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <PageShell>
      <section className="grid min-h-[80vh] place-items-center bg-subtle-gradient px-4 py-16">
        <div className="w-full max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-hero-gradient text-primary-foreground shadow-elegant">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl">Welcome to LearnHub Tech</h1>
            <p className="mt-2 text-muted-foreground">Choose how you'd like to join the platform.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link to="/auth/learner" className="group">
              <Card className="h-full p-8 transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">I'm a Learner</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enrol in courses, follow lessons, take quizzes, and earn your certificate.
                </p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Continue as Learner <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>

            <Link to="/auth/facilitator" className="group">
              <Card className="h-full p-8 transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">I'm a Facilitator</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create and manage courses, modules, lessons, and quiz questions for your learners.
                </p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Continue as Facilitator <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Not sure? You can always contact us from the <Link to="/contact" className="underline">Contact</Link> page.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
