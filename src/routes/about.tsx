import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LearnHub Tech — Our mission & vision" },
      { name: "description", content: "Learn about LearnHub Tech, our mission to make web development accessible, and the values that guide our teaching." },
      { property: "og:title", content: "About LearnHub Tech" },
      { property: "og:description", content: "Our mission, vision and core values." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { title: "Clarity", desc: "Complex topics explained in simple, human language." },
  { title: "Practice", desc: "Every lesson is paired with exercises and real code." },
  { title: "Progress", desc: "We celebrate small wins that build lasting skill." },
  { title: "Access", desc: "Learning should be free and open to every student." },
];

function AboutPage() {
  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="font-display text-5xl font-bold md:text-6xl">About <span className="bg-hero-gradient bg-clip-text text-transparent">LearnHub Tech</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We're an online learning platform built for South African high school and first-year university students who want to build a career in tech — starting with the fundamentals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 shadow-card">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold">Mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">To make web development education clear, practical and accessible to every learner, regardless of background.</p>
          </Card>
          <Card className="p-6 shadow-card">
            <Eye className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold">Vision</h2>
            <p className="mt-2 text-sm text-muted-foreground">A generation of confident, curious builders who can turn ideas into products for the web.</p>
          </Card>
          <Card className="p-6 shadow-card">
            <Heart className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold">Why we exist</h2>
            <p className="mt-2 text-sm text-muted-foreground">Because a first working web page can change a student's whole sense of what's possible.</p>
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-3xl font-bold">Core values</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title} className="p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold text-primary">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
