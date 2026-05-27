import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BookOpen, BrainCircuit, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Card, PageHeader, SectionTitle, Badge, ProgressBar, EmptyState, PrimaryButton, SecondaryButton } from "@/components/app/ui-bits";
import { resolveStudentId } from "@/lib/defaults";
import { useMarks } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/student/subjects")({
  head: () => ({ meta: [{ title: "Subjects — AetherLMS" }] }),
  component: StudentSubjectsPage,
});

function StudentSubjectsPage() {
  const studentId = resolveStudentId(null);
  const { data: marks, isLoading, isError } = useMarks(studentId);

  const subjects = useMemo(() => {
    const map = new Map<string, { total: number; max: number; count: number }>();
    (marks ?? []).forEach((mark) => {
      const current = map.get(mark.subject) ?? { total: 0, max: 0, count: 0 };
      map.set(mark.subject, {
        total: current.total + mark.marks,
        max: current.max + mark.max_marks,
        count: current.count + 1,
      });
    });
    return Array.from(map.entries()).map(([subject, totals]) => ({
      subject,
      percent: totals.max ? Math.round((totals.total / totals.max) * 100) : 0,
      count: totals.count,
    }));
  }, [marks]);

  const trend = useMemo(() => {
    const map = new Map<string, { total: number; max: number }>();
    (marks ?? []).forEach((item) => {
      const current = map.get(item.exam) ?? { total: 0, max: 0 };
      map.set(item.exam, { total: current.total + item.marks, max: current.max + item.max_marks });
    });
    return Array.from(map.entries()).map(([exam, totals]) => ({
      exam,
      score: totals.max ? Math.round((totals.total / totals.max) * 100) : 0,
    }));
  }, [marks]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student subjects"
        title="Subjects"
        subtitle={`Academic progress for ${studentId} with performance cards, trend analysis, and study direction.`}
        actions={<Badge tone="brand">{subjects.length} subjects</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Plan</Badge>} description="Pick the subject that needs help first, then keep the session short and targeted.">
            Revision board
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Current average</p>
                    <p className="mt-1 text-sm text-muted-foreground">Across all graded subjects</p>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{Math.round(subjects.reduce((sum, item) => sum + item.percent, 0) / Math.max(1, subjects.length) || 0)}%</span>
                </div>
                <div className="mt-4">
                  <ProgressBar value={Math.round(subjects.reduce((sum, item) => sum + item.percent, 0) / Math.max(1, subjects.length) || 0)} tone="brand" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 p-4">
                  <p className="text-sm font-semibold text-foreground">Weakest subject</p>
                  <p className="mt-1 text-sm text-muted-foreground">Start here for the next revision cycle.</p>
                </div>
                <div className="rounded-2xl border border-border/70 p-4">
                  <p className="text-sm font-semibold text-foreground">Strongest subject</p>
                  <p className="mt-1 text-sm text-muted-foreground">Keep this one warm with light practice.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Study tools</p>
              <div className="grid gap-2">
                <PrimaryButton>Start 20 min revision</PrimaryButton>
                <SecondaryButton>Ask AI for a hint</SecondaryButton>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">Short sessions beat long ones when you want better recall and less fatigue.</p>
              <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground">
                Next step: focus on one weak topic and one practice set only.
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Direction</Badge>} description="Turn the chart below into a weekly habit, not a one-off check.">
            Revision guide
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Short rule</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">One subject, one worksheet, one practice question bank.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 px-4 py-3 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Weekly habit</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Review the weakest subject twice: once before practice and once after.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Performance</Badge>} description="Subject cards with clearer hierarchy and lightweight progress presentation.">
            Subject performance
          </SectionTitle>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isError && <p className="text-sm text-danger">Failed to load marks.</p>}
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <Card key={`subject-skeleton-${index}`} className="p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-8 w-20" />
              </Card>
            ))}
            {subjects.map((subject) => (
              <Card key={subject.subject} className="p-4" hoverable>
                <p className="text-sm font-semibold text-foreground">{subject.subject}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{subject.percent}%</p>
                <p className="mt-1 text-xs text-muted-foreground">{subject.count} assessment(s)</p>
                <div className="mt-4">
                  <ProgressBar value={subject.percent} tone={subject.percent >= 85 ? "success" : subject.percent >= 70 ? "brand" : "warning"} />
                </div>
              </Card>
            ))}
            {!isLoading && !isError && subjects.length === 0 && (
              <EmptyState
                title="No subject marks found"
                description="Once assessments are recorded, subject performance cards and revision insights will appear here."
                icon={BookOpen}
              />
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Trend</Badge>} description="A line chart that makes it easy to see performance across exams.">
            Performance trend
          </SectionTitle>
          <div className="h-72">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <ResponsiveContainer>
                <LineChart data={trend} margin={{ left: -12, right: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="exam" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16 }} />
                  <Line type="monotone" dataKey="score" stroke="var(--brand-600)" strokeWidth={3} dot={{ r: 4, fill: "var(--brand-600)" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
            <p className="text-sm font-semibold text-foreground">Revision insight</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">The chart suggests a stable upward slope. Keep your weakest subject on a short weekly revision loop and maintain the strongest subject with light practice.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}