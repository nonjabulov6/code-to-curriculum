import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Award, Download, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/_authenticated/course-completed")({
  head: () => ({ meta: [{ title: "Course Completed — LearnHub Tech" }] }),
  component: CourseCompleted,
});

function CourseCompleted() {
  const { user } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);

  const q = useQuery({
    queryKey: ["course-completed", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: course } = await supabase.from("courses").select("*").eq("slug", "web-development-fundamentals").maybeSingle();
      const { data: profile } = await supabase.from("profiles").select("full_name,email").eq("id", user!.id).maybeSingle();
      return { course, profile };
    },
  });

  const learnerName = q.data?.profile?.full_name || q.data?.profile?.email || "Learner";
  const courseTitle = q.data?.course?.title ?? "Web Development Fundamentals";
  const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  function downloadCertificate() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Certificate — ${learnerName}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  body { margin: 0; font-family: Georgia, 'Times New Roman', serif; color: #1e293b; }
  .cert { width: 100vw; height: 100vh; padding: 60px; box-sizing: border-box; background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 18px solid #0066cc; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .brand { letter-spacing: 6px; font-size: 14px; color: #0066cc; font-weight: 700; text-transform: uppercase; }
  h1 { font-size: 56px; margin: 20px 0 8px; color: #0f172a; }
  .sub { font-size: 18px; color: #475569; margin-bottom: 40px; }
  .name { font-size: 48px; margin: 24px 0; color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 8px; display: inline-block; }
  .course { font-size: 24px; margin: 20px 0; }
  .meta { margin-top: 40px; font-size: 14px; color: #64748b; }
  @media print { .noprint { display: none; } }
  .noprint { position: fixed; top: 16px; right: 16px; }
</style></head>
<body>
  <div class="cert">
    <div class="brand">LearnHub Tech</div>
    <h1>Certificate of Completion</h1>
    <div class="sub">This certificate is proudly presented to</div>
    <div class="name">${learnerName}</div>
    <div class="sub">for successfully completing the course</div>
    <div class="course"><strong>${courseTitle}</strong></div>
    <div class="meta">Issued on ${dateStr}</div>
  </div>
  <button class="noprint" onclick="window.print()">Print / Save as PDF</button>
  <script>setTimeout(() => window.print(), 400);</script>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `LearnHubTech-Certificate-${learnerName.replace(/\s+/g, "-")}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <Award className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Course Completed! 🎉</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Congratulations {learnerName.split(" ")[0]} — you've finished every module of {courseTitle}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <Card ref={certRef} className="p-10 text-center shadow-elegant border-2 border-primary/30">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">LearnHub Tech</div>
          <h2 className="mt-4 font-display text-3xl font-bold">Certificate of Completion</h2>
          <p className="mt-4 text-muted-foreground">This certificate is proudly presented to</p>
          <div className="mt-3 inline-block border-b-2 border-primary pb-1 font-display text-3xl font-bold text-primary">{learnerName}</div>
          <p className="mt-4 text-muted-foreground">for successfully completing</p>
          <div className="mt-2 text-xl font-semibold">{courseTitle}</div>
          <div className="mt-6 text-sm text-muted-foreground">Issued on {dateStr}</div>
        </Card>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={downloadCertificate}>
            <Download className="mr-2 h-4 w-4" /> Download Certificate
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Return to Dashboard</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
