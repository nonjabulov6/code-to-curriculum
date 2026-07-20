import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import surveyHero from "@/assets/survey-hero.jpg";

export const Route = createFileRoute("/survey")({
  head: () => ({
    meta: [
      { title: "Student Survey — LearnHub Tech" },
      { name: "description", content: "Share your feedback about the LearnHub Tech course. Help us improve the learning experience." },
      { property: "og:title", content: "Student Survey — LearnHub Tech" },
      { property: "og:description", content: "Give feedback on the Web Development Fundamentals course." },
    ],
  }),
  component: SurveyPage,
});

const modules = ["HTML Fundamentals", "CSS Fundamentals", "JavaScript Fundamentals", "SQL Fundamentals"];

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
          <Star className={`h-7 w-7 transition ${n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  );
}

function Scale({ value, onChange, labels }: { value: number; onChange: (n: number) => void; labels: [string, string] }) {
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-10 w-10 rounded-md border text-sm font-semibold transition ${
              value === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
}

function SurveyPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    favourite_module: "",
    difficulty_rating: 3,
    video_usefulness: 4,
    quiz_difficulty: 3,
    overall_rating: 5,
    would_recommend: true,
    liked_most: "",
    suggestions: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim()) return toast.error("Please enter your full name");
    if (!form.favourite_module) return toast.error("Please pick a favourite module");
    setSaving(true);
    const { error } = await supabase.from("surveys").insert({
      user_id: user?.id ?? null,
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      favourite_module: form.favourite_module,
      difficulty_rating: form.difficulty_rating,
      video_usefulness: form.video_usefulness,
      quiz_difficulty: form.quiz_difficulty,
      overall_rating: form.overall_rating,
      would_recommend: form.would_recommend,
      liked_most: form.liked_most.trim() || null,
      suggestions: form.suggestions.trim() || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <PageShell>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold">Thank you!</h1>
          <p className="mt-3 text-muted-foreground">
            Your feedback has been submitted successfully. It helps us make LearnHub Tech better for the next student.
          </p>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">Student Survey</h1>
            <p className="mt-3 max-w-xl opacity-90">
              Finished the course? Tell us what worked, what didn't, and how we can make LearnHub Tech even better.
            </p>
          </div>
          <img src={surveyHero} alt="Student giving feedback" width={1400} height={800} loading="lazy" className="rounded-xl shadow-elegant" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card className="p-6 shadow-card md:p-8">
          <form onSubmit={submit} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Full name *</Label>
                <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Favourite module *</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {modules.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, favourite_module: m })}
                    className={`rounded-md border px-4 py-3 text-left text-sm transition ${
                      form.favourite_module === m ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border hover:bg-accent"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Course difficulty</Label>
              <div className="mt-2"><Scale value={form.difficulty_rating} onChange={(n) => setForm({ ...form, difficulty_rating: n })} labels={["Very easy", "Very hard"]} /></div>
            </div>

            <div>
              <Label>How useful were the videos?</Label>
              <div className="mt-2"><Scale value={form.video_usefulness} onChange={(n) => setForm({ ...form, video_usefulness: n })} labels={["Not useful", "Extremely useful"]} /></div>
            </div>

            <div>
              <Label>Quiz difficulty</Label>
              <div className="mt-2"><Scale value={form.quiz_difficulty} onChange={(n) => setForm({ ...form, quiz_difficulty: n })} labels={["Very easy", "Very hard"]} /></div>
            </div>

            <div>
              <Label>Overall rating</Label>
              <div className="mt-2"><Stars value={form.overall_rating} onChange={(n) => setForm({ ...form, overall_rating: n })} /></div>
            </div>

            <div>
              <Label>Would you recommend this course?</Label>
              <div className="mt-2 flex gap-2">
                {[
                  { v: true, l: "Yes" },
                  { v: false, l: "No" },
                ].map((o) => (
                  <button
                    key={o.l}
                    type="button"
                    onClick={() => setForm({ ...form, would_recommend: o.v })}
                    className={`rounded-md border px-6 py-2 text-sm font-medium transition ${
                      form.would_recommend === o.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="liked_most">What did you like most?</Label>
              <Textarea id="liked_most" rows={3} value={form.liked_most} onChange={(e) => setForm({ ...form, liked_most: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="suggestions">Suggestions for improvement</Label>
              <Textarea id="suggestions" rows={3} value={form.suggestions} onChange={(e) => setForm({ ...form, suggestions: e.target.value })} />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={saving}>
              {saving ? "Submitting…" : "Submit feedback"}
            </Button>
          </form>
        </Card>
      </section>
    </PageShell>
  );
}
