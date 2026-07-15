import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact LearnHub Tech" },
      { name: "description", content: "Get in touch with the LearnHub Tech team. Email, phone or send us a message directly." },
      { property: "og:title", content: "Contact LearnHub Tech" },
      { property: "og:description", content: "Get in touch with the LearnHub Tech team." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) { toast.error("Could not send message"); return; }
    toast.success("Message sent — we'll be in touch!");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="font-display text-5xl font-bold md:text-6xl">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Questions, feedback or partnership ideas — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-start gap-3"><Mail className="mt-1 h-5 w-5 text-primary" /><div><div className="font-semibold">Email</div><div className="text-sm text-muted-foreground">hello@learnhubtech.com</div></div></div>
          <div className="flex items-start gap-3"><Phone className="mt-1 h-5 w-5 text-primary" /><div><div className="font-semibold">Phone</div><div className="text-sm text-muted-foreground">+27 11 000 0000</div></div></div>
          <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-primary" /><div><div className="font-semibold">Location</div><div className="text-sm text-muted-foreground">Johannesburg, South Africa</div></div></div>
        </div>
        <Card className="p-6 shadow-card md:col-span-2">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="name">Name</Label><Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} /></div>
            </div>
            <div><Label htmlFor="subject">Subject</Label><Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={200} /></div>
            <div><Label htmlFor="message">Message</Label><Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required maxLength={5000} /></div>
            <Button type="submit" size="lg" disabled={submitting}>{submitting ? "Sending…" : "Send message"}</Button>
          </form>
        </Card>
      </section>
    </PageShell>
  );
}
