import { ReactNode } from "react";
import { Callout } from "./callout";
import { LessonCard } from "./lesson-card";
import { StepList } from "./step-list";
import { KnowledgeCheck } from "./knowledge-check";
import { Reflection } from "./reflection";

type ContentBlock = 
  | { type: "text"; content: string }
  | { type: "heading"; level: 2 | 3 | 4; content: string }
  | { type: "callout"; calloutType: "info" | "tip" | "warning" | "success" | "error"; title?: string; content: string }
  | { type: "card"; title?: string; content: string; variant?: "default" | "outline" | "subtle" }
  | { type: "steps"; steps: { title: string; content: string }[] }
  | { type: "code"; language?: string; code: string; title?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quiz"; question: string; options: string[]; correctIndex: number; explanation?: string }
  | { type: "reflection"; prompt: string; placeholder?: string; feedback?: string };

interface ContentRendererProps {
  content: string | ContentBlock[];
}

export function ContentRenderer({ content }: ContentRendererProps) {
  // If content is a simple string, render it as text (backward compatibility)
  if (typeof content === "string") {
    // Basic heuristic to check if it's a JSON string representing ContentBlock[]
    if (content.trim().startsWith("[") && content.trim().endsWith("]")) {
      try {
        const parsed = JSON.parse(content);
        return <ContentBlocks blocks={parsed} />;
      } catch {
        return <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{content}</p>;
      }
    }
    return <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{content}</p>;
  }

  return <ContentBlocks blocks={content} />;
}

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return <p key={i} className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{block.content}</p>;
          
          case "heading":
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            const sizes = { 2: "text-3xl", 3: "text-2xl", 4: "text-xl" };
            return (
              <Tag key={i} className={`font-display font-bold mt-10 mb-4 ${sizes[block.level]}`}>
                {block.content}
              </Tag>
            );

          case "callout":
            return (
              <Callout key={i} type={block.calloutType} title={block.title}>
                {block.content}
              </Callout>
            );

          case "card":
            return (
              <LessonCard key={i} title={block.title} variant={block.variant}>
                {block.content}
              </LessonCard>
            );

          case "steps":
            return <StepList key={i} steps={block.steps} />;

          case "code":
            return (
              <div key={i} className="my-8 overflow-hidden rounded-xl border border-border bg-slate-950 shadow-md">
                {block.title && (
                  <div className="border-b border-white/10 bg-white/5 px-4 py-2 text-xs font-mono text-slate-400">
                    {block.title}
                  </div>
                )}
                <pre className="overflow-x-auto p-5 text-sm text-slate-50 font-mono">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          case "list":
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag key={i} className={block.ordered ? "list-decimal pl-6 space-y-2" : "list-disc pl-6 space-y-2"}>
                {block.items.map((item, j) => (
                  <li key={j} className="text-lg text-muted-foreground">{item}</li>
                ))}
              </ListTag>
            );

          case "quiz":
            return (
              <KnowledgeCheck 
                key={i}
                question={block.question}
                options={block.options}
                correctIndex={block.correctIndex}
                explanation={block.explanation}
              />
            );

          case "reflection":
            return (
              <Reflection 
                key={i}
                prompt={block.prompt}
                placeholder={block.placeholder}
                feedback={block.feedback}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
