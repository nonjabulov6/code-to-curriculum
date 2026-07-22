import { createFileRoute } from "@tanstack/react-router";
import { RoleAuthForm } from "@/components/auth/role-auth-form";

export const Route = createFileRoute("/auth/learner")({
  head: () => ({
    meta: [
      { title: "Learner sign up — LearnHub Tech" },
      { name: "description", content: "Create a Learner account on LearnHub Tech to enrol in courses, follow lessons, and take quizzes." },
      { property: "og:title", content: "Learner sign up — LearnHub Tech" },
      { property: "og:description", content: "Join LearnHub Tech as a Learner and start your web development journey." },
    ],
  }),
  component: () => (
    <RoleAuthForm
      role="student"
      accent="learner"
      title="Join as a Learner"
      subtitle="Enrol in courses, track your progress, and earn your certificate."
    />
  ),
});
