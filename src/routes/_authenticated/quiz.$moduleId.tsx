import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Trophy, PartyPopper, ArrowRight, GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/quiz/$moduleId")({
  head: () => ({ meta: [{ title: "Quiz — LearnHub Tech" }] }),
  component: QuizPage,
});

interface Question { id: string; question: string; options: string[]; correct_index: number; explanation: string | null }

const PASS_THRESHOLD = 0.6;

function QuizPage() {
  const { moduleId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const q = useQuery({
    queryKey: ["quiz-context", moduleId],
    queryFn: async () => {
      const { data: mod } = await supabase.from("modules").select("*").eq("id", moduleId).maybeSingle();
      const { data: qs } = await supabase.from("quiz_questions").select("*").eq("module_id", moduleId).order("position");
      let siblings: { id: string; position: number; title: string }[] = [];
      if (mod) {
        const { data: sibs } = await supabase.from("modules").select("id,position,title").eq("course_id", mod.course_id).order("position");
        siblings = sibs ?? [];
      }
      return { module: mod, questions: (qs ?? []) as unknown as Question[], siblings };
    },
  });

  async function submit() {
    if (!q.data) return;
    const questions = q.data.questions;
    let correct = 0;
    for (const qu of questions) if (answers[qu.id] === qu.correct_index) correct++;
    setScore(correct);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await supabase.from("quiz_attempts").insert({ user_id: user!.id, module_id: moduleId, score: correct, total: questions.length });
    const ratio = questions.length ? correct / questions.length : 0;
    if (ratio >= PASS_THRESHOLD) {
      await supabase.from("module_progress").upsert(
        { user_id: user!.id, module_id: moduleId, completed: true, completed_at: new Date().toISOString() },
        { onConflict: "user_id,module_id" },
      );
      toast.success(`You passed with ${correct} / ${questions.length}!`);
    } else {
      toast.info(`You scored ${correct} / ${questions.length}. Try again to pass.`);
    }
  }

  if (q.isLoading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!q.data?.module) return <PageShell><div className="p-20 text-center">Module not found.</div></PageShell>;

  const { module, questions, siblings } = q.data;
  const allAnswered = questions.length > 0 && questions.every((qu) => answers[qu.id] !== undefined);
  const currentIdx = siblings.findIndex((s) => s.id === moduleId);
  const nextModule = currentIdx >= 0 ? siblings[currentIdx + 1] : undefined;
  const isLast = currentIdx >= 0 && currentIdx === siblings.length - 1;
  const ratio = questions.length ? score / questions.length : 0;
  const passed = ratio >= PASS_THRESHOLD;

  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link to="/lessons/$moduleId" params={{ moduleId }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to lessons</Link>
          <h1 className="mt-4 font-display text-4xl font-bold">Quiz: {module.title}</h1>
          <p className="mt-2 text-muted-foreground">Answer all questions, then submit to see your score and feedback.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        {submitted && (
          <Card className="p-8 text-center shadow-elegant">
            {passed ? <PartyPopper className="mx-auto h-14 w-14 text-primary" /> : <Trophy className="mx-auto h-14 w-14 text-muted-foreground" />}
            <h2 className="mt-4 font-display text-3xl font-bold">{passed ? "Congratulations!" : "Almost there"}</h2>
            <div className="mt-2 text-5xl font-bold text-primary">{score} / {questions.length}</div>
            <p className="mt-3 text-muted-foreground">
              {passed ? `Great work — you've completed ${module.title}!` : "You need at least 60% to pass. Review the feedback below and try again."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {!passed && (
                <>
                  <Button variant="outline" onClick={() => { setSubmitted(false); setAnswers({}); }}>Retake quiz</Button>
                  <Button asChild variant="secondary"><Link to="/lessons/$moduleId" params={{ moduleId }}>Review lessons</Link></Button>
                </>
              )}
              {passed && !isLast && nextModule && (
                <Button size="lg" onClick={() => navigate({ to: "/lessons/$moduleId", params: { moduleId: nextModule.id } })}>
                  Next Module: {nextModule.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {passed && isLast && (
                <Button size="lg" onClick={() => navigate({ to: "/dashboard" })}>
                  <GraduationCap className="mr-2 h-4 w-4" /> Continue to Final Exam
                </Button>
              )}
              {passed && (
                <Button variant="outline" asChild><Link to="/dashboard">Dashboard</Link></Button>
              )}
            </div>
          </Card>
        )}

        {questions.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No quiz questions yet.</Card>
        ) : (
          <div className="space-y-6">
            {questions.map((qu, i) => {
              const chosen = answers[qu.id];
              const isCorrect = chosen === qu.correct_index;
              return (
                <Card key={qu.id} className="p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">Question {i + 1}</div>
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
                        <div key={idx} className={`flex items-center gap-3 rounded-lg border p-3 transition ${isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : isWrongPick ? "border-destructive bg-destructive/10" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                          <RadioGroupItem value={idx.toString()} id={`${qu.id}-${idx}`} disabled={submitted} />
                          <Label htmlFor={`${qu.id}-${idx}`} className="flex-1 cursor-pointer">{opt}</Label>
                          {isRight && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                          {isWrongPick && <XCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {submitted && qu.explanation && (
                    <div className={`mt-4 rounded-lg border-l-4 p-3 text-sm ${isCorrect ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20" : "border-primary bg-accent/40"}`}>
                      <div className="font-semibold">{isCorrect ? "Why this is correct" : "Correct answer explained"}</div>
                      <p className="mt-1 text-muted-foreground">{qu.explanation}</p>
                    </div>
                  )}
                </Card>
              );
            })}
            {!submitted && <Button size="lg" onClick={submit} disabled={!allAnswered}>Submit quiz</Button>}
          </div>
        )}
      </section>
    </PageShell>
  );
}
