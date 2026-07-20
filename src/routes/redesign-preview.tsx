import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Callout } from "@/components/lesson/callout";
import { LessonCard } from "@/components/lesson/lesson-card";
import { StepList } from "@/components/lesson/step-list";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart } from "lucide-react";

export const Route = createFileRoute("/redesign-preview")({
  component: RedesignPreview,
});

function RedesignPreview() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 8 min read</span>
            <span className="flex items-center gap-1.5"><BarChart className="h-4 w-4" /> Beginner</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Component Redesign Preview</h1>
          <p className="text-xl text-muted-foreground">Testing the new foundational UI components for the text-based lesson experience.</p>
        </div>

        <section className="space-y-8">
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold">Callouts</h2>
            <Callout type="info" title="Information">
              This is a standard information callout used to highlight important context.
            </Callout>
            <Callout type="tip" title="Pro Tip">
              Use this for helpful hints and best practices that learners should know.
            </Callout>
            <Callout type="warning" title="Watch Out">
              Warn learners about common mistakes or pitfalls they might encounter.
            </Callout>
          </div>

          <div>
            <h2 className="mb-4 font-display text-2xl font-bold">Lesson Cards</h2>
            <LessonCard title="Key Concept: Modular Design">
              Modular design is an approach that subdivides a system into smaller parts called modules, which can be independently created and then used in different systems.
            </LessonCard>
            <LessonCard variant="subtle">
              This is a subtle variant of the lesson card, perfect for secondary information or examples.
            </LessonCard>
          </div>

          <div>
            <h2 className="mb-4 font-display text-2xl font-bold">Step Lists</h2>
            <StepList 
              steps={[
                { 
                  title: "Analyze Requirements", 
                  content: "Understand the core needs of the learner and the objectives of the lesson." 
                },
                { 
                  title: "Design Components", 
                  content: "Create reusable UI elements that follow instructional design principles." 
                },
                { 
                  title: "Build Layout", 
                  content: "Assemble the components into a cohesive and engaging learning flow." 
                }
              ]} 
            />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
