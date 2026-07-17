import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { BookOpen, Code2, Video, Wrench, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — LearnHub Tech" },
      { name: "description", content: "Curated free resources for learning HTML, CSS, JavaScript and SQL." },
      { property: "og:title", content: "Resources — LearnHub Tech" },
      { property: "og:description", content: "Docs, tools, videos and cheatsheets for beginner web developers." },
    ],
  }),
  component: ResourcesPage,
});

const groups = [
  { icon: BookOpen, title: "Documentation", items: [
    { name: "MDN Web Docs", url: "https://developer.mozilla.org/", note: "The trusted reference for HTML, CSS and JavaScript." },
    { name: "W3Schools", url: "https://www.w3schools.com/", note: "Beginner-friendly tutorials with try-it examples." },
    { name: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/", note: "The official SQL reference." },
  ]},
  { icon: Code2, title: "Free Online Editors", items: [
    { name: "CodePen", url: "https://codepen.io/", note: "Practise HTML/CSS/JS in the browser." },
    { name: "SQLite Online", url: "https://sqliteonline.com/", note: "Run SQL queries with no install." },
    { name: "JSFiddle", url: "https://jsfiddle.net/", note: "Quickly test JavaScript snippets." },
  ]},
  { icon: Video, title: "Recommended Video Channels", items: [
    { name: "freeCodeCamp", url: "https://www.youtube.com/c/Freecodecamp", note: "Full-length beginner courses." },
    { name: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia", note: "Practical crash courses." },
    { name: "The Net Ninja", url: "https://www.youtube.com/@NetNinja", note: "Structured playlists per topic." },
  ]},
  { icon: Wrench, title: "Tools", items: [
    { name: "Visual Studio Code", url: "https://code.visualstudio.com/", note: "The free code editor most developers use." },
    { name: "Google Chrome DevTools", url: "https://developer.chrome.com/docs/devtools/", note: "Inspect and debug web pages." },
    { name: "GitHub", url: "https://github.com/", note: "Store and share your code." },
  ]},
];

function ResourcesPage() {
  return (
    <PageShell>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Resources</h1>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">Free, hand-picked links to help you keep learning outside the platform.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <Card key={g.title} className="p-6 shadow-card">
              <div className="flex items-center gap-2"><g.icon className="h-6 w-6 text-primary" /><h2 className="font-display text-xl font-bold">{g.title}</h2></div>
              <ul className="mt-4 space-y-3">
                {g.items.map((i) => (
                  <li key={i.url}>
                    <a href={i.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 font-medium text-primary hover:underline">
                      {i.name} <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                    <p className="text-sm text-muted-foreground">{i.note}</p>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
