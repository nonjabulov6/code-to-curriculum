import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Star,
  CheckCircle2,
  User,
  BookOpen,
  Video,
  Gauge,
  Brain,
  Trophy,
  MessageSquare,
  ThumbsUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutDashboard,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/survey")({
  head: () => ({
    meta: [
      { title: "Student Feedback Survey — LearnHub Tech" },
      {
        name: "description",
        content:
          "Share detailed feedback about your LearnHub Tech learning experience in a modern step-by-step survey.",
      },
      { property: "og:title", content: "Student Feedback Survey — LearnHub Tech" },
      {
        property: "og:description",
        content: "Multi-step survey to help us improve LearnHub Tech courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SurveyPage,
});

const modules = ["HTML Fundamentals", "CSS Fundamentals", "JavaScript Fundamentals", "SQL Fundamentals"];
const occupations = ["High School Student", "University Student", "Graduate", "Working Professional", "Other"];
const ageGroups = ["Under 18", "18–24", "25–34", "35–44", "45+"];
const knowledgeLevels = ["Beginner", "Intermediate", "Advanced"];

const courseExperience = [
  "The learning objectives were clear.",
  "The lessons were easy to follow.",
  "The course content was well organized.",
  "The examples helped me understand the concepts.",
  "The practical exercises improved my understanding.",
  "The quizzes matched the lesson content.",
  "The lesson length was appropriate.",
  "The pace of the course was comfortable.",
  "I felt engaged throughout the lessons.",
];
const materials = [
  "Video quality",
  "Audio quality",
  "Video length",
  "Text explanations",
  "Images and diagrams",
  "Code examples",
  "Downloadable resources",
];
const difficultyModules = ["HTML difficulty", "CSS difficulty", "JavaScript difficulty", "SQL difficulty"];
const confidenceItems = [
  "Build a webpage",
  "Style a webpage with CSS",
  "Write JavaScript",
  "Create SQL queries",
];
const outcomes = [
  "I completed all lessons",
  "I completed all quizzes",
  "I built the practical project",
  "I understand the fundamentals",
  "I feel ready for the next module",
];

type StepDef = { id: string; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> };

const steps: StepDef[] = [
  { id: "info", title: "Your details", subtitle: "Tell us who you are", icon: User },
  { id: "experience", title: "Course experience", subtitle: "How the learning went", icon: BookOpen },
  { id: "materials", title: "Videos & materials", subtitle: "Rate the resources", icon: Video },
  { id: "difficulty", title: "Difficulty", subtitle: "How each module felt", icon: Gauge },
  { id: "knowledge", title: "Knowledge & confidence", subtitle: "Before vs. after", icon: Brain },
  { id: "outcomes", title: "Course outcomes", subtitle: "What you achieved", icon: Trophy },
  { id: "open", title: "Open feedback", subtitle: "In your own words", icon: MessageSquare },
  { id: "nps", title: "Recommend us", subtitle: "0 to 10", icon: ThumbsUp },
  { id: "rating", title: "Overall rating", subtitle: "One quick star rating", icon: Star },
  { id: "certificate", title: "Certificate", subtitle: "Optional keepsake", icon: Award },
];

type Ratings = Record<string, number>;

function StarsInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="transition hover:scale-110"
        >
          <Star
            className={`h-10 w-10 transition ${
              n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ScaleRow({
  label,
  value,
  onChange,
  max = 5,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}) {
  const options = Array.from({ length: max === 10 ? 11 : max }, (_, i) => (max === 10 ? i : i + 1));
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4 transition hover:border-primary/30 hover:shadow-sm">
      <div className="mb-3 text-sm font-medium text-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 min-w-9 rounded-md border px-2 text-sm font-semibold transition ${
              value === n
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-foreground/70 hover:border-primary/40 hover:bg-accent"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

function ChoiceGrid({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
            value === o
              ? "border-primary bg-primary/5 font-semibold text-primary shadow-sm"
              : "border-border bg-background hover:border-primary/30 hover:bg-accent"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: StepDef["icon"]; title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-bold leading-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function SurveyPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);

  // Section 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [favouriteModule, setFavouriteModule] = useState("");

  // Section 2 & 3 & 4
  const [experience, setExperience] = useState<Ratings>({});
  const [materialRatings, setMaterialRatings] = useState<Ratings>({});
  const [difficulty, setDifficulty] = useState<Ratings>({});

  // Section 5
  const [knowledgeBefore, setKnowledgeBefore] = useState("");
  const [confidence, setConfidence] = useState<Ratings>({});

  // Section 6
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);

  // Section 7
  const [likedMost, setLikedMost] = useState("");
  const [improve, setImprove] = useState("");
  const [confusing, setConfusing] = useState("");
  const [nextTopics, setNextTopics] = useState("");

  // Section 8, 9, 10
  const [nps, setNps] = useState<number>(-1);
  const [overall, setOverall] = useState(0);
  const [wantsCert, setWantsCert] = useState<boolean | null>(null);
  const [certName, setCertName] = useState("");
  const [certEmail, setCertEmail] = useState("");

  const progressPct = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  function toggleOutcome(o: string) {
    setSelectedOutcomes((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
  }

  function validateStep(i: number): string | null {
    if (i === 0) {
      if (!fullName.trim()) return "Please enter your full name.";
      if (!occupation) return "Please select your occupation.";
      if (!ageGroup) return "Please select your age group.";
      if (!favouriteModule) return "Please pick the module you completed.";
    }
    if (i === 4 && !knowledgeBefore) return "Please rate your prior knowledge.";
    if (i === 7 && nps < 0) return "Please choose an NPS score from 0 to 10.";
    if (i === 8 && overall === 0) return "Please give an overall rating.";
    if (i === 9) {
      if (wantsCert === null) return "Please choose whether you want a certificate.";
      if (wantsCert) {
        if (!certName.trim()) return "Please enter the name for your certificate.";
        if (!certEmail.trim()) return "Please enter your preferred email.";
      }
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) return toast.error(err);
    setStep((s) => Math.min(s + 1, steps.length - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    const err = validateStep(9);
    if (err) return toast.error(err);
    setSaving(true);
    const avgExperience =
      Object.values(experience).length > 0
        ? Math.round(Object.values(experience).reduce((a, b) => a + b, 0) / Object.values(experience).length)
        : 0;
    const avgVideo = materialRatings["Video quality"] ?? materialRatings["Text explanations"] ?? 0;
    const avgDifficulty =
      Object.values(difficulty).length > 0
        ? Math.round(Object.values(difficulty).reduce((a, b) => a + b, 0) / Object.values(difficulty).length)
        : 0;

    const { error } = await supabase.from("surveys").insert({
      user_id: user?.id ?? null,
      full_name: fullName.trim(),
      email: email.trim() || null,
      favourite_module: favouriteModule,
      occupation,
      age_group: ageGroup,
      knowledge_before: knowledgeBefore,
      nps_score: nps,
      overall_rating: overall,
      would_recommend: nps >= 7,
      difficulty_rating: avgDifficulty || 3,
      video_usefulness: avgVideo || 3,
      quiz_difficulty: experience["The quizzes matched the lesson content."] ?? 3,
      liked_most: likedMost.trim() || null,
      suggestions: [improve, confusing, nextTopics].filter((s) => s.trim()).join("\n\n") || null,
      wants_certificate: !!wantsCert,
      certificate_name: wantsCert ? certName.trim() : null,
      certificate_email: wantsCert ? certEmail.trim() : null,
      responses: {
        experience,
        materials: materialRatings,
        difficulty,
        confidence,
        outcomes: selectedOutcomes,
        openFeedback: { likedMost, improve, confusing, nextTopics },
        avgExperience,
      },
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <PageShell>
        <section className="mx-auto max-w-2xl px-4 py-20">
          <Card className="rounded-2xl p-10 text-center shadow-elegant">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold">🎉 Thank you for your feedback!</h1>
            <p className="mt-3 text-muted-foreground">
              Your responses help us improve LearnHub Tech for future learners.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {wantsCert && user && (
                <Button size="lg" asChild>
                  <Link to="/course-completed">
                    <Download className="mr-2 h-4 w-4" /> Download Certificate
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link to="/courses">
                  <GraduationCap className="mr-2 h-4 w-4" /> Continue Learning
                </Link>
              </Button>
              {user && (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Return to Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        </section>
      </PageShell>
    );
  }

  const current = steps[step];

  return (
    <PageShell>
      <section className="border-b border-border/50 bg-background">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Student Feedback Survey
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Help us shape a better learning experience
          </h1>
          <p className="mt-2 text-muted-foreground">
            10 quick sections — takes about 4 minutes. Your answers are anonymous unless you request a certificate.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Step {step + 1} of {steps.length} · {current.title}
              </span>
              <span className="text-muted-foreground">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
            <div className="mt-4 hidden flex-wrap gap-1.5 md:flex">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={`grid h-8 w-8 place-items-center rounded-md border text-xs font-semibold transition ${
                    i === step
                      ? "border-primary bg-primary text-primary-foreground"
                      : i < step
                        ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                  title={s.title}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <Card className="rounded-2xl p-6 shadow-card md:p-10 animate-fade-up">
          <SectionHeader icon={current.icon} title={current.title} subtitle={current.subtitle} />

          {step === 0 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="full_name">Full name *</Label>
                  <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Current occupation *</Label>
                <ChoiceGrid options={occupations} value={occupation} onChange={setOccupation} />
              </div>
              <div>
                <Label className="mb-2 block">Age group *</Label>
                <ChoiceGrid options={ageGroups} value={ageGroup} onChange={setAgeGroup} columns={3} />
              </div>
              <div>
                <Label className="mb-2 block">Which module did you complete? *</Label>
                <ChoiceGrid options={modules} value={favouriteModule} onChange={setFavouriteModule} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).
              </p>
              {courseExperience.map((label) => (
                <ScaleRow
                  key={label}
                  label={label}
                  value={experience[label] ?? 0}
                  onChange={(n) => setExperience({ ...experience, [label]: n })}
                  minLabel="Strongly disagree"
                  maxLabel="Strongly agree"
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Rate each item from 1 to 5.</p>
              {materials.map((label) => (
                <ScaleRow
                  key={label}
                  label={label}
                  value={materialRatings[label] ?? 0}
                  onChange={(n) => setMaterialRatings({ ...materialRatings, [label]: n })}
                  minLabel="Poor"
                  maxLabel="Excellent"
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">1 = Very easy · 5 = Very hard</p>
              {difficultyModules.map((label) => (
                <ScaleRow
                  key={label}
                  label={label}
                  value={difficulty[label] ?? 0}
                  onChange={(n) => setDifficulty({ ...difficulty, [label]: n })}
                  minLabel="Very easy"
                  maxLabel="Very hard"
                />
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Before this course, how would you rate your knowledge? *</Label>
                <ChoiceGrid options={knowledgeLevels} value={knowledgeBefore} onChange={setKnowledgeBefore} columns={3} />
              </div>
              <div>
                <Label className="mb-2 block">
                  After completing the course, how confident are you that you can:
                </Label>
                <p className="mb-3 text-sm text-muted-foreground">1 = Not confident · 5 = Very confident</p>
                <div className="space-y-3">
                  {confidenceItems.map((label) => (
                    <ScaleRow
                      key={label}
                      label={label}
                      value={confidence[label] ?? 0}
                      onChange={(n) => setConfidence({ ...confidence, [label]: n })}
                      minLabel="Not confident"
                      maxLabel="Very confident"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Select everything that applies.</p>
              {outcomes.map((o) => {
                const active = selectedOutcomes.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => toggleOutcome(o)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                      active
                        ? "border-primary bg-primary/5 font-semibold text-primary shadow-sm"
                        : "border-border bg-background hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded border-2 transition ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                      }`}
                    >
                      {active && <CheckCircle2 className="h-4 w-4" />}
                    </span>
                    <span>{o}</span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="liked_most">What did you enjoy most about this course?</Label>
                <Textarea id="liked_most" rows={4} value={likedMost} onChange={(e) => setLikedMost(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="improve">What could we improve?</Label>
                <Textarea id="improve" rows={4} value={improve} onChange={(e) => setImprove(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="confusing">Was anything confusing?</Label>
                <Textarea id="confusing" rows={4} value={confusing} onChange={(e) => setConfusing(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="next_topics">What topics would you like to learn next?</Label>
                <Textarea id="next_topics" rows={4} value={nextTopics} onChange={(e) => setNextTopics(e.target.value)} />
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                How likely are you to recommend LearnHub Tech to a friend?
              </p>
              <ScaleRow
                label="Choose a score from 0 to 10"
                value={nps}
                onChange={setNps}
                max={10}
                minLabel="Not at all likely"
                maxLabel="Extremely likely"
              />
              {nps >= 0 && (
                <div
                  className={`rounded-xl border p-4 text-sm ${
                    nps >= 9
                      ? "border-success/40 bg-success/5 text-success-foreground"
                      : nps >= 7
                        ? "border-primary/40 bg-primary/5 text-primary"
                        : "border-destructive/40 bg-destructive/5 text-destructive"
                  }`}
                >
                  {nps >= 9 ? "Promoter 🎉 — thanks for spreading the word!" : nps >= 7 ? "Passive 🙂 — glad you enjoyed it." : "Detractor — we'll work to do better."}
                </div>
              )}
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">Tap the stars to give your overall rating.</p>
              <div className="flex justify-center">
                <StarsInput value={overall} onChange={setOverall} />
              </div>
              {overall > 0 && (
                <div className="text-lg font-semibold text-primary">
                  {["", "Poor", "Fair", "Good", "Great", "Excellent"][overall]}
                </div>
              )}
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Would you like to receive a completion certificate? *</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { v: true, l: "Yes, please" },
                    { v: false, l: "No thanks" },
                  ].map((o) => (
                    <button
                      key={o.l}
                      type="button"
                      onClick={() => setWantsCert(o.v)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        wantsCert === o.v
                          ? "border-primary bg-primary/5 font-semibold text-primary shadow-sm"
                          : "border-border bg-background hover:border-primary/30 hover:bg-accent"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
              {wantsCert && (
                <div className="grid gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="cert_name">Certificate name *</Label>
                    <Input id="cert_name" value={certName} onChange={(e) => setCertName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="cert_email">Preferred email *</Label>
                    <Input
                      id="cert_email"
                      type="email"
                      value={certEmail}
                      onChange={(e) => setCertEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
            <Button type="button" variant="outline" onClick={back} disabled={step === 0}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={next} size="lg">
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={submit} disabled={saving} size="lg">
                {saving ? "Submitting…" : "Submit feedback"}
              </Button>
            )}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
