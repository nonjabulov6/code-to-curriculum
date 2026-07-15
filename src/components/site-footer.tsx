import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            LearnHub Tech
          </div>
          <p className="mt-3 max-w-md text-sm text-secondary-foreground/70">
            An online learning platform for high school (Grades 10–12) and first-year university students who want to master web development.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/70">
            <li><Link to="/" className="hover:text-primary-foreground">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary-foreground">About</Link></li>
            <li><Link to="/course" className="hover:text-primary-foreground">Course</Link></li>
            <li><Link to="/contact" className="hover:text-primary-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@learnhubtech.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +27 11 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} LearnHub Tech. All rights reserved.
      </div>
    </footer>
  );
}
