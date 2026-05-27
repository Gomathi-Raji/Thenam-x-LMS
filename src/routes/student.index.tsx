import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarClock, Flame, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, PrimaryButton, SecondaryButton, ProgressBar } from "@/components/app/ui-bits";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Student Dashboard — AetherLMS" }] }),
  component: StudentDashboardPage,
});

function StudentDashboardPage() {
  const tasks = [
    { title: "Physics worksheet", due: "Tomorrow", status: "Urgent" },
    { title: "Math revision set", due: "Fri", status: "In progress" },
    { title: "English summary", due: "Next week", status: "Pending" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student learning hub"
        title="Student Dashboard"
        subtitle="A motivating workspace that surfaces progress, deadlines, habits, and AI study guidance without feeling noisy or childish."
        actions={
          <>
            <Badge tone="success"><Flame className="mr-1 inline size-3" />7 day streak</Badge>
            <PrimaryButton>Open AI tutor</PrimaryButton>
            <SecondaryButton>View schedule</SecondaryButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Today</Badge>} description="See what to do next without scanning a wall of stats.">
            Study board
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{task.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Due {task.due}</p>
                    </div>
                    <Badge tone={task.status === "Urgent" ? "warning" : task.status === "In progress" ? "brand" : "neutral"}>{task.status}</Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted/50">
                    <div className={`h-2 rounded-full ${index === 0 ? "bg-warning-500 w-3/4" : index === 1 ? "bg-brand-500 w-1/2" : "bg-success-500 w-1/3"}`} />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Quick study tools</p>
              <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                <p className="flex items-center gap-2"><CalendarClock className="size-4 text-brand-600" />Open your timetable and jump to the next class.</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success-600" />Check off the assignment you can finish in 20 minutes.</p>
                <p className="flex items-center gap-2"><Sparkles className="size-4 text-brand-600" />Ask the AI tutor for one hint, not the full answer.</p>
              </div>
              <div className="grid gap-2 pt-1">
                <PrimaryButton>Open AI tutor</PrimaryButton>
                <SecondaryButton>View calendar</SecondaryButton>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Momentum</Badge>} description="This is your weekly direction, not a generic KPI dump.">
            Learning rhythm
          </SectionTitle>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Today’s plan</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>Finish the urgent worksheet before the end of lunch.</li>
                <li>Use one revision block for math and one for physics.</li>
                <li>Send a question to a teacher if you get stuck for more than 10 minutes.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Focus streak</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Your consistency is strongest when you study in short blocks before dinner. Keep that pattern for the next three days.</p>
            </div>
            <div className="rounded-2xl border border-border/70 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Assignments completed</span>
                <span className="text-muted-foreground">72%</span>
              </div>
              <ProgressBar value={72} tone="success" />
              <div className="mt-4 mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Exam readiness</span>
                <span className="text-muted-foreground">81%</span>
              </div>
              <ProgressBar value={81} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}