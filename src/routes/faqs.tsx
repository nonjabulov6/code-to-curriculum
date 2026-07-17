import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — LearnHub Tech" },
      { name: "description", content: "Answers to the most common questions about LearnHub Tech." },
      { property: "og:title", content: "FAQs — LearnHub Tech" },
      { property: "og:description", content: "Everything you need to know before you start learning." },
    ],
  }),
  component: FaqsPage,
});

const faqs = [
  { q: "Do I need any programming experience to start?", a: "No. LearnHub Tech is designed for absolute beginners — high school learners (Grades 10–12) and first-year university students. Every technical term is explained before it is used." },
  { q: "Is LearnHub Tech free?", a: "Yes. You can register, enroll in the Web Development Fundamentals course and take every module and quiz for free." },
  { q: "How long does the course take?", a: "The course is self-paced. Most students complete it in 4 to 6 weeks studying a few hours per week." },
  { q: "What do I need to install?", a: "Nothing. All you need is a modern browser like Chrome or Firefox. When you are ready you can install a free editor like Visual Studio Code." },
  { q: "How does the final exam work?", a: "Once you complete all four modules, the Final Examination unlocks. It has 40 multiple-choice questions (10 from each module). You need 70% or higher to pass and download your certificate." },
  { q: "Can I retake a quiz?", a: "Yes. If you do not pass a module quiz (60%) you can retake it as many times as you like. Only your latest passing attempt is used for progress." },
  { q: "Will I get a certificate?", a: "Yes. When you pass the Final Examination you can download a printable Certificate of Completion with your name and the date." },
  { q: "Can teachers use this with their class?", a: "Yes. Sign up as a Facilitator to create and manage your own courses, modules, lessons and quizzes." },
];

function FaqsPage() {
  return (
    <PageShell>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-3 max-w-xl opacity-90">Everything you need to know before you begin.</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageShell>
  );
}
