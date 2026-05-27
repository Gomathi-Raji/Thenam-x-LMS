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

      <Card className="p-5">
        <SectionTitle action={<Badge tone="brand">Today</Badge>} description="The most useful work is the next thing you can finish, not the biggest number on the page.">
          Study lane
        </SectionTitle>
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <Badge tone={task.status === "Urgent" ? "warning" : task.status === "In progress" ? "brand" : "neutral"}>{task.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Due {task.due}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
            <p className="text-sm font-semibold text-foreground">Focus for today</p>
            <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
              <li>Finish one urgent assignment before moving to the next subject.</li>
              <li>Keep revision short and active, not long and passive.</li>
              <li>Use the AI tutor for one question, not the full lesson.</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">This week</Badge>} description="A balanced study plan with clear priorities and measurable momentum.">
            Study plan
          </SectionTitle>
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due {task.due}</p>
                  </div>
                  <Badge tone={task.status === "Urgent" ? "warning" : task.status === "In progress" ? "brand" : "neutral"}>{task.status}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle action={<Badge tone="brand">AI recommended</Badge>}>Next best actions</SectionTitle>
            <div className="space-y-3">
              {[
                "Revise integration by parts in mathematics.",
                "Practice 5-minute physics recap questions.",
                "Finish English summary before dinner.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/70 px-4 py-3">
                  <Sparkles className="mt-0.5 size-4 text-brand-600" />
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle action={<Badge tone="success">On track</Badge>}>Progress</SectionTitle>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Assignments completed</span>
                  <span className="text-muted-foreground">72%</span>
                </div>
                <ProgressBar value={72} tone="success" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Exam readiness</span>
                  <span className="text-muted-foreground">81%</span>
                </div>
                <ProgressBar value={81} />
              </div>
              <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
                <p className="text-sm font-semibold text-foreground">Study focus</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Your strongest subject is mathematics. The biggest win this week will come from short, repeated revision blocks before each lesson.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}