import { createFileRoute } from "@tanstack/react-router";
import { Clock3, KanbanSquare, FileCheck2, Sparkles } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, ProgressBar, EmptyState, PrimaryButton, SecondaryButton } from "@/components/app/ui-bits";
import { resolveStudentId } from "@/lib/defaults";
import { useStudentAssignments } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Assignments — AetherLMS" }] }),
  component: StudentAssignmentsPage,
});

function StudentAssignmentsPage() {
  const studentId = resolveStudentId(null);
  const { data: assignments, isLoading, isError } = useStudentAssignments(studentId);
  const pending = (assignments ?? []).filter((assignment) => assignment.status === "pending");
  const submitted = (assignments ?? []).filter((assignment) => assignment.status === "submitted");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student assignments"
        title="Assignments"
        subtitle={`Student ${studentId} with a cleaner Kanban-style overview, urgency cues, and submission progress.`}
        actions={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Focus</Badge>} description="Use the list below as a real study queue, not a passive summary.">
            Study lane
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{pending.length} pending tasks</p>
                    <p className="mt-1 text-sm text-muted-foreground">{submitted.length} already submitted</p>
                  </div>
                  <Badge tone={pending.length > 0 ? "warning" : "success"}>{pending.length > 0 ? "Needs work" : "All clear"}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                {pending.slice(0, 3).map((assignment) => (
                  <div key={`lane-${assignment.assignment_id}`} className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{assignment.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{assignment.subject} • Due {new Date(assignment.due_date).toLocaleDateString()}</p>
                  </div>
                ))}
                {pending.length === 0 && <p className="text-sm text-muted-foreground">You are caught up for now.</p>}
              </div>
            </div>
            <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Task actions</p>
              <div className="grid gap-2">
                <PrimaryButton>Open next task</PrimaryButton>
                <SecondaryButton>Ask AI for a hint</SecondaryButton>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground">
                Finish one urgent task before moving to a new subject.
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Momentum</Badge>} description="A quick view of the work that is already done and what still needs marks.">
            Submission rhythm
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Submission progress</p>
              <p className="mt-1 text-sm text-muted-foreground">Keep one assignment active at a time to reduce task switching.</p>
              <div className="mt-3">
                <ProgressBar value={pending.length || 25} tone="warning" />
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 px-4 py-3 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Submit early tip</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">If a task is nearly done, submit it before starting a new one so feedback comes back sooner.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>} description="A board-style layout with stronger urgency cues and more readable task cards.">
          Assignment board
        </SectionTitle>
        <div className="grid gap-4 lg:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, index) => (
            <div key={`assignment-skeleton-${index}`} className="rounded-2xl border border-border/70 p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          ))}
          {isError && <p className="text-sm text-danger">Failed to load assignments.</p>}

          <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Pending</p>
              <Badge tone="warning">{pending.length}</Badge>
            </div>
            <div className="space-y-3">
              {pending.map((assignment) => (
                <div key={assignment.assignment_id} className="rounded-2xl border border-border/70 bg-card p-4">
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{assignment.subject} • Due {new Date(assignment.due_date).toLocaleDateString()}</p>
                  <div className="mt-3">
                    <ProgressBar value={35} tone="warning" />
                  </div>
                </div>
              ))}
              {!isLoading && !isError && pending.length === 0 && <EmptyState title="All caught up" description="No pending tasks are waiting right now." />}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Submitted</p>
              <Badge tone="success">{submitted.length}</Badge>
            </div>
            <div className="space-y-3">
              {submitted.map((assignment) => (
                <div key={assignment.assignment_id} className="rounded-2xl border border-border/70 bg-card p-4">
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{assignment.subject} • Marked {assignment.submission_marks ?? 0}/100</p>
                  <div className="mt-3">
                    <ProgressBar value={assignment.submission_marks ?? 86} tone="success" />
                  </div>
                </div>
              ))}
              {!isLoading && !isError && submitted.length === 0 && <EmptyState title="Nothing submitted yet" description="Submitted work will appear here with marks and progress." />}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Submission history</p>
              <Badge tone="brand">Latest</Badge>
            </div>
            <div className="space-y-3">
              {(assignments ?? []).slice(0, 4).map((assignment) => (
                <div key={`history-${assignment.assignment_id}`} className="rounded-2xl border border-border/70 bg-card p-4">
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{assignment.subject} • {assignment.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}