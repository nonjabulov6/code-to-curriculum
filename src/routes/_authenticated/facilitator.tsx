import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/facilitator")({
  head: () => ({ meta: [{ title: "Facilitator — LearnHub Tech" }] }),
  component: FacilitatorPage,
});

function FacilitatorPage() {
  const { isAdmin, isFacilitator, loading } = useAuth();
  if (loading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!isFacilitator && !isAdmin) return <Navigate to="/dashboard" />;
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl font-bold">Facilitator panel</h1>
        <p className="mt-2 text-muted-foreground">Create and manage courses, modules, lessons and quizzes.</p>
        <Tabs defaultValue="courses" className="mt-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          <TabsContent value="courses"><CoursesAdmin /></TabsContent>
          <TabsContent value="modules"><ModulesAdmin /></TabsContent>
          <TabsContent value="lessons"><LessonsAdmin /></TabsContent>
          <TabsContent value="quiz"><QuizAdmin /></TabsContent>
        </Tabs>
      </section>
    </PageShell>
  );
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CoursesAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", duration: "", difficulty: "Beginner" });
  const coursesQ = useQuery({
    queryKey: ["fac-courses"],
    queryFn: async () => (await supabase.from("courses").select("*").order("created_at")).data ?? [],
  });

  async function add() {
    const slug = slugify(form.title);
    const { error } = await supabase.from("courses").insert({
      title: form.title, description: form.description, duration: form.duration, difficulty: form.difficulty, slug,
    });
    if (error) return toast.error(error.message);
    setForm({ title: "", description: "", duration: "", difficulty: "Beginner" });
    toast.success("Course added");
    qc.invalidateQueries({ queryKey: ["fac-courses"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this course and all its modules, lessons, and quizzes?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["fac-courses"] });
  }

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-6 shadow-card">
        <h3 className="font-semibold">Add course</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Duration (e.g. 6 weeks)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <Input placeholder="Difficulty" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button className="mt-3" onClick={add} disabled={!form.title}>Add</Button>
      </Card>
      <div className="space-y-2">
        {coursesQ.data?.map((c) => (
          <Card key={c.id} className="flex items-center justify-between p-4 shadow-card">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-muted-foreground">{c.description}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.duration} · {c.difficulty}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ModulesAdmin() {
  const qc = useQueryClient();
  const coursesQ = useQuery({ queryKey: ["fac-courses-list"], queryFn: async () => (await supabase.from("courses").select("id,title").order("created_at")).data ?? [] });
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const modulesQ = useQuery({
    queryKey: ["fac-modules", courseId],
    enabled: !!courseId,
    queryFn: async () => (await supabase.from("modules").select("*").eq("course_id", courseId).order("position")).data ?? [],
  });

  const [overview, setOverview] = useState("");
  const [objectivesText, setObjectivesText] = useState("");

  async function add() {
    const pos = (modulesQ.data?.length ?? 0) + 1;
    const objectives = objectivesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("modules").insert({ course_id: courseId, title, description, position: pos, overview: overview || null, objectives: objectives.length ? objectives : null });
    if (error) return toast.error(error.message);
    setTitle(""); setDescription(""); setOverview(""); setObjectivesText("");
    toast.success("Module added");
    qc.invalidateQueries({ queryKey: ["fac-modules", courseId] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this module and all its lessons/questions?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["fac-modules", courseId] });
  }

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-6 shadow-card">
        <Label>Course</Label>
        <select className="mt-2 w-full rounded-md border border-input bg-background p-2 text-sm" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select course…</option>
          {coursesQ.data?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        {courseId && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Button className="md:col-span-2" onClick={add} disabled={!title}>Add module</Button>
          </div>
        )}
      </Card>
      <div className="space-y-2">
        {modulesQ.data?.map((m) => (
          <Card key={m.id} className="flex items-center justify-between p-4 shadow-card">
            <div><div className="font-semibold">{m.position}. {m.title}</div><div className="text-sm text-muted-foreground">{m.description}</div></div>
            <Button variant="ghost" size="sm" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LessonsAdmin() {
  const qc = useQueryClient();
  const modulesQ = useQuery({ queryKey: ["fac-modules-list"], queryFn: async () => (await supabase.from("modules").select("id,title").order("position")).data ?? [] });
  const [moduleId, setModuleId] = useState("");
  const [form, setForm] = useState({ title: "", content: "", code_example: "", exercise: "" });
  const lessonsQ = useQuery({
    queryKey: ["fac-lessons", moduleId],
    enabled: !!moduleId,
    queryFn: async () => (await supabase.from("lessons").select("*").eq("module_id", moduleId).order("position")).data ?? [],
  });

  async function add() {
    const pos = (lessonsQ.data?.length ?? 0) + 1;
    const { error } = await supabase.from("lessons").insert({ ...form, module_id: moduleId, position: pos });
    if (error) return toast.error(error.message);
    setForm({ title: "", content: "", code_example: "", exercise: "" });
    toast.success("Lesson added");
    qc.invalidateQueries({ queryKey: ["fac-lessons", moduleId] });
  }
  async function remove(id: string) {
    if (!confirm("Delete lesson?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["fac-lessons", moduleId] });
  }

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-6 shadow-card">
        <Label>Module</Label>
        <select className="mt-2 w-full rounded-md border border-input bg-background p-2 text-sm" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
          <option value="">Select module…</option>
          {modulesQ.data?.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        {moduleId && (
          <div className="mt-4 space-y-3">
            <Input placeholder="Lesson title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <Textarea placeholder="Code example (optional)" value={form.code_example} onChange={(e) => setForm({ ...form, code_example: e.target.value })} className="font-mono text-sm" />
            <Textarea placeholder="Practice exercise (optional)" value={form.exercise} onChange={(e) => setForm({ ...form, exercise: e.target.value })} />
            <Button onClick={add} disabled={!form.title || !form.content}>Add lesson</Button>
          </div>
        )}
      </Card>
      <div className="space-y-2">
        {lessonsQ.data?.map((l) => (
          <Card key={l.id} className="flex items-center justify-between p-4 shadow-card">
            <div className="font-semibold">{l.position}. {l.title}</div>
            <Button variant="ghost" size="sm" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuizAdmin() {
  const qc = useQueryClient();
  const modulesQ = useQuery({ queryKey: ["fac-modules-list"], queryFn: async () => (await supabase.from("modules").select("id,title").order("position")).data ?? [] });
  const [moduleId, setModuleId] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const questionsQ = useQuery({
    queryKey: ["fac-quiz", moduleId],
    enabled: !!moduleId,
    queryFn: async () => (await supabase.from("quiz_questions").select("*").eq("module_id", moduleId).order("position")).data ?? [],
  });

  async function add() {
    const pos = (questionsQ.data?.length ?? 0) + 1;
    const { error } = await supabase.from("quiz_questions").insert({ module_id: moduleId, question, options, correct_index: correct, position: pos });
    if (error) return toast.error(error.message);
    setQuestion(""); setOptions(["", "", "", ""]); setCorrect(0);
    toast.success("Question added");
    qc.invalidateQueries({ queryKey: ["fac-quiz", moduleId] });
  }
  async function remove(id: string) {
    await supabase.from("quiz_questions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["fac-quiz", moduleId] });
  }

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-6 shadow-card">
        <Label>Module</Label>
        <select className="mt-2 w-full rounded-md border border-input bg-background p-2 text-sm" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
          <option value="">Select module…</option>
          {modulesQ.data?.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        {moduleId && (
          <div className="mt-4 space-y-3">
            <Input placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" checked={correct === i} onChange={() => setCorrect(i)} />
                <Input placeholder={`Option ${i + 1}`} value={o} onChange={(e) => { const n = [...options]; n[i] = e.target.value; setOptions(n); }} />
              </div>
            ))}
            <Button onClick={add} disabled={!question || options.some((o) => !o)}>Add question</Button>
          </div>
        )}
      </Card>
      <div className="space-y-2">
        {questionsQ.data?.map((qu) => (
          <Card key={qu.id} className="flex items-center justify-between p-4 shadow-card">
            <div className="font-semibold">{qu.question}</div>
            <Button variant="ghost" size="sm" onClick={() => remove(qu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
