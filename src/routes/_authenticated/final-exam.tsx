import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Timer, Award, Lock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/final-exam")({
  head: () => ({ meta: [{ title: "Final Examination — LearnHub Tech" }] }),
  component: FinalExamPage,
});

interface Question { id: string; question: string; options: string[]; correct_index: number; explanation: string | null; module_id: string }

const EXAM_MINUTES = 45;
const PASS = 0.7;

function FinalExamPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(EXAM_MINUTES * 60);

  const q = useQuery({
    queryKey: ["final-exam", user?.id],
    queryFn: async () => {
      const { data: modules } = await supabase.from("modules").select("id,title,position,course_id").order("position");
      const { data: progress } = await supabase.from("module_progress").select("module_id,completed").eq("user_id", user!.id);
      const completedIds = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.module_id as string));
      const allDone = (modules ?? []).length > 0 && (modules ?? []).every((m) => completedIds.has(m.id));
      let questions: Question[] = [];
      if (allDone) {
        const { data: qs } = await supabase.from("quiz_questions").select("*").order("position");
        // 10 per module
        const byModule = new Map<string, Question[]>();
        for (const raw of (qs ?? []) as unknown as Question[]) {
          const arr = byModule.get(raw.module_id) ?? [];
          arr.push(raw);
          byModule.set(raw.module_id, arr);
        }
        for (const m of modules ?? []) {
          const pool = byModule.get(m.id) ?? [];
          questions = questions.concat(pool.slice(0, 10));
        }
      }
      return { modules: modules ?? [], allDone, questions };
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!started || submitted) return;
    if (remaining <= 0) { void submit(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [started, submitted, remaining]);

  const total = q.data?.questions.length ?? 0;
  const score = useMemo(() => {
    if (!q.data) return 0;
    let s = 0;
    for (const qu of q.data.questions) if (answers[qu.id] === qu.correct_index) s++;
    return s;
  }, [answers, q.data]);

  async function submit() {
    if (submitted || !q.data) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const passed = total > 0 && score / total >= PASS;
    // Store as a special attempt against the last module id (or any); use zero uuid trick: use last module_id
    const modId = q.data.modules[q.data.modules.length - 1]?.id;
    if (modId) {
      await supabase.from("quiz_attempts").insert({ user_id: user!.id, module_id: modId, score, total });
    }
    if (passed) toast.success(`You passed the final exam with ${score}/${total}!`);
    else toast.info(`You scored ${score}/${total}. You need ${Math.ceil(total * PASS)} to pass.`);
  }

  if (q.isLoading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;

  if (!q.data?.allDone) {
    return (
      <PageShell>
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-3xl font-bold">Final Examination is locked</h1>
          <p className="mt-3 text-muted-foreground">Complete all four modules to unlock the final exam.</p>
          <Button asChild className="mt-6"><Link to="/dashboard">Back to dashboard</Link></Button>
        </section>
      </PageShell>
    );
  }

  const passed = total > 0 && score / total >= PASS;
  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  if (!started) {
    return (
      <PageShell>
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Award className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-bold">Final Examination</h1>
          <p className="mt-3 text-muted-foreground">
            {total} multiple-choice questions · 10 from each module · {EXAM_MINUTES} minute timer · pass mark 70%
          </p>
          <Card className="mt-6 p-6 text-left text-sm text-muted-foreground shadow-card">
            <ul className="list-disc space-y-1 pl-5">
              <li>Once you begin, the timer starts and cannot be paused.</li>
              <li>Your score and feedback will appear immediately after you submit.</li>
              <li>If you don't pass, you can retake the exam.</li>
              <li>Pass to unlock your Certificate of Completion.</li>
            </ul>
          </Card>
          <Button size="lg" className="mt-8" onClick={() => setStarted(true)}>Start exam</Button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="sticky top-16 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Exit</Link>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${remaining < 300 ? "bg-destructive/10 text-destructive" : "bg-accent"}`}>
            <Timer className="h-4 w-4" />{mm}:{ss}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {submitted && (
          <Card className="p-8 text-center shadow-elegant">
            <Award className={`mx-auto h-14 w-14 ${passed ? "text-primary" : "text-muted-foreground"}`} />
            <h2 className="mt-4 font-display text-3xl font-bold">{passed ? "You passed!" : "Not quite yet"}</h2>
            <div className="mt-2 text-5xl font-bold text-primary">{score} / {total}</div>
            <p className="mt-3 text-muted-foreground">
              {passed ? "You have completed the Web Development Fundamentals course." : `You need ${Math.ceil(total * PASS)} correct answers to pass. Review the explanations below and try again.`}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {passed
                ? <Button size="lg" asChild><Link to="/course-completed"><Award className="mr-2 h-4 w-4" />Get your certificate</Link></Button>
                : <Button size="lg" onClick={() => { setAnswers({}); setSubmitted(false); setStarted(false); setRemaining(EXAM_MINUTES*60); }}>Retake exam</Button>}
              <Button variant="outline" asChild><Link to="/dashboard">Back to dashboard</Link></Button>
            </div>
          </Card>
        )}

        {q.data.questions.map((qu, i) => {
          const chosen = answers[qu.id];
          const isCorrect = chosen === qu.correct_index;
          return (
            <Card key={qu.id} className="p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Question {i + 1} of {total}</div>
                {submitted && (isCorrect
                  ? <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 className="h-4 w-4" />Correct</span>
                  : <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive"><XCircle className="h-4 w-4" />Incorrect</span>)}
              </div>
              <h3 className="mt-1 text-lg font-semibold">{qu.question}</h3>
              <RadioGroup className="mt-4 space-y-2" value={chosen?.toString() ?? ""} onValueChange={(v) => !submitted && setAnswers((a) => ({ ...a, [qu.id]: Number(v) }))}>
                {qu.options.map((opt, idx) => {
                  const isRight = submitted && idx === qu.correct_index;
                  const isWrongPick = submitted && idx === chosen && idx !== qu.correct_index;
                  return (
                    <div key={idx} className={`flex items-center gap-3 rounded-lg border p-3 transition ${isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : isWrongPick ? "border-destructive bg-destructive/10" : "border-border hover:border-primary/40"}`}>
                      <RadioGroupItem value={idx.toString()} id={`fe-${qu.id}-${idx}`} disabled={submitted} />
                      <Label htmlFor={`fe-${qu.id}-${idx}`} className="flex-1 cursor-pointer">{opt}</Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {submitted && qu.explanation && !isCorrect && (
                <div className="mt-4 rounded-lg border-l-4 border-primary bg-accent/40 p-3 text-sm">
                  <div className="font-semibold">Correct answer explained</div>
                  <p className="mt-1 text-muted-foreground">{qu.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}

        {!submitted && (
          <Button size="lg" onClick={submit} className="w-full">Submit exam</Button>
        )}
      </section>
    </PageShell>
  );
}
