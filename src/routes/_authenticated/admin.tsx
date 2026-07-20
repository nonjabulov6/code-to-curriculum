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

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — LearnHub Tech" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl font-bold">Admin panel</h1>
        <p className="mt-2 text-muted-foreground">Manage courses, modules, lessons, quizzes, students and contact messages.</p>
        <Tabs defaultValue="modules" className="mt-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
          </TabsList>
          <TabsContent value="modules"><ModulesAdmin /></TabsContent>
          <TabsContent value="lessons"><LessonsAdmin /></TabsContent>
          <TabsContent value="quiz"><QuizAdmin /></TabsContent>
          <TabsContent value="students"><StudentsAdmin /></TabsContent>
          <TabsContent value="messages"><MessagesAdmin /></TabsContent>
          <TabsContent value="surveys"><SurveysAdmin /></TabsContent>
        </Tabs>
      </section>
    </PageShell>
  );
}

function ModulesAdmin() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const modulesQ = useQuery({
    queryKey: ["admin-modules"],
    queryFn: async () => {
      const { data } = await supabase.from("modules").select("*, courses(title)").order("position");
      return data ?? [];
    },
  });

  async function addModule() {
    const { data: course } = await supabase.from("courses").select("id").eq("slug", "web-development-fundamentals").maybeSingle();
    if (!course) return toast.error("No course");
    const pos = (modulesQ.data?.length ?? 0) + 1;
    const { error } = await supabase.from("modules").insert({ course_id: course.id, title, description, position: pos });
    if (error) return toast.error(error.message);
    setTitle(""); setDescription("");
    toast.success("Module added");
    qc.invalidateQueries({ queryKey: ["admin-modules"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this module and all its lessons/questions?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-modules"] });
  }

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-6 shadow-card">
        <h3 className="font-semibold">Add module</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button className="mt-3" onClick={addModule} disabled={!title}>Add</Button>
      </Card>
      <div className="space-y-2">
        {modulesQ.data?.map((m) => (
          <Card key={m.id} className="flex items-center justify-between p-4 shadow-card">
            <div><div className="font-semibold">{m.title}</div><div className="text-sm text-muted-foreground">{m.description}</div></div>
            <Button variant="ghost" size="sm" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LessonsAdmin() {
  const qc = useQueryClient();
  const modulesQ = useQuery({ queryKey: ["admin-modules-list"], queryFn: async () => (await supabase.from("modules").select("id,title").order("position")).data ?? [] });
  const [moduleId, setModuleId] = useState<string>("");
  const [form, setForm] = useState({ title: "", content: "", code_example: "", exercise: "" });

  const lessonsQ = useQuery({
    queryKey: ["admin-lessons", moduleId],
    enabled: !!moduleId,
    queryFn: async () => (await supabase.from("lessons").select("*").eq("module_id", moduleId).order("position")).data ?? [],
  });

  async function add() {
    const pos = (lessonsQ.data?.length ?? 0) + 1;
    const { error } = await supabase.from("lessons").insert({ ...form, module_id: moduleId, position: pos });
    if (error) return toast.error(error.message);
    setForm({ title: "", content: "", code_example: "", exercise: "" });
    toast.success("Lesson added");
    qc.invalidateQueries({ queryKey: ["admin-lessons", moduleId] });
  }
  async function remove(id: string) {
    if (!confirm("Delete lesson?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-lessons", moduleId] });
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
  const modulesQ = useQuery({ queryKey: ["admin-modules-list"], queryFn: async () => (await supabase.from("modules").select("id,title").order("position")).data ?? [] });
  const [moduleId, setModuleId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  const questionsQ = useQuery({
    queryKey: ["admin-quiz", moduleId],
    enabled: !!moduleId,
    queryFn: async () => (await supabase.from("quiz_questions").select("*").eq("module_id", moduleId).order("position")).data ?? [],
  });

  async function add() {
    const pos = (questionsQ.data?.length ?? 0) + 1;
    const { error } = await supabase.from("quiz_questions").insert({ module_id: moduleId, question, options, correct_index: correct, position: pos });
    if (error) return toast.error(error.message);
    setQuestion(""); setOptions(["", "", "", ""]); setCorrect(0);
    toast.success("Question added");
    qc.invalidateQueries({ queryKey: ["admin-quiz", moduleId] });
  }
  async function remove(id: string) {
    await supabase.from("quiz_questions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-quiz", moduleId] });
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

function StudentsAdmin() {
  const q = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => (await supabase.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <div className="mt-4">
      <Card className="p-6 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Joined</th></tr></thead>
            <tbody>
              {q.data?.map((s) => (
                <tr key={s.id} className="border-b"><td className="p-2 font-medium">{s.full_name}</td><td className="p-2 text-muted-foreground">{s.email}</td><td className="p-2 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function MessagesAdmin() {
  const q = useQuery({ queryKey: ["admin-messages"], queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? [] });
  return (
    <div className="mt-4 space-y-2">
      {q.data?.map((m) => (
        <Card key={m.id} className="p-4 shadow-card">
          <div className="flex justify-between"><div className="font-semibold">{m.name} <span className="text-muted-foreground">· {m.email}</span></div><div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div></div>
          {m.subject && <div className="mt-1 text-sm font-medium">{m.subject}</div>}
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{m.message}</p>
        </Card>
      ))}
      {q.data?.length === 0 && <Card className="p-8 text-center text-muted-foreground">No messages yet.</Card>}
    </div>
  );
}
