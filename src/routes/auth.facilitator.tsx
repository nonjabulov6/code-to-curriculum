import { createFileRoute } from "@tanstack/react-router";
import { RoleAuthForm } from "@/components/auth/role-auth-form";

export const Route = createFileRoute("/auth/facilitator")({
  head: () => ({
    meta: [
      { title: "Facilitator sign up — LearnHub Tech" },
      { name: "description", content: "Create a Facilitator account on LearnHub Tech to build and manage courses, modules, lessons, and quizzes." },
      { property: "og:title", content: "Facilitator sign up — LearnHub Tech" },
      { property: "og:description", content: "Teach on LearnHub Tech: create courses, modules, and quizzes for your learners." },
    ],
  }),
  component: () => (
    <RoleAuthForm
      role="facilitator"
      accent="facilitator"
      title="Join as a Facilitator"
      subtitle="Create courses, build lessons, and design quizzes for your learners."
    />
  ),
});
