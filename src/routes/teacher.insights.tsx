import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, BookOpen, ShieldAlert, TrendingUp } from "lucide-react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, SectionTitle, Badge, ProgressBar, EmptyState, PrimaryButton, SecondaryButton } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useClassAnalytics } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/teacher/insights")({
  head: () => ({ meta: [{ title: "Class Insights — AetherLMS" }] }),
  component: TeacherInsightsPage,
});

function TeacherInsightsPage() {
  const classId = resolveTeacherClassId();
  const { data: analytics, isLoading, isError } = useClassAnalytics(classId);
  const subjectScores = analytics?.subject_scores ?? [];
  const topSubject = subjectScores.slice().sort((a, b) => b.averageScore - a.averageScore)[0];
  const weakSubject = subjectScores.slice().sort((a, b) => a.averageScore - b.averageScore)[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher analytics"
        title="Class Insights"
        subtitle={`Analytics for ${classId} with a more polished breakdown of attendance, scores, and subject trends.`}
        actions={<Badge tone="brand">Insights live</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Next action</Badge>} description="This page should help decide what to teach next, not show another KPI wall.">
            Teaching signal
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Class strength</p>
                    <p className="mt-1 text-sm text-muted-foreground">{String(analytics?.student_count ?? 0)} students active in this class</p>
                  </div>
                  <Badge tone="brand">Active</Badge>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Attendance signal</p>
                    <p className="mt-1 text-sm text-muted-foreground">{analytics?.attendance_rate ?? 0}% attendance this term</p>
                  </div>
                  <Badge tone="success">Stable</Badge>
                </div>
                <div className="mt-4">
                  <ProgressBar value={analytics?.attendance_rate ?? 0} tone="success" />
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Intervention tools</p>
              <div className="grid gap-2">
                <PrimaryButton>Plan catch-up lesson</PrimaryButton>
                <SecondaryButton>Message weak-subject group</SecondaryButton>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">Use the weakest subject to decide where to spend the next 30 minutes of lesson prep.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Focus</Badge>} description="A short list of what the numbers actually mean for your next lesson.">
            Teaching summary
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Top subject</p>
              <p className="mt-1 text-sm text-muted-foreground">{topSubject ? `${topSubject.subject} (${topSubject.averageScore}%)` : "No data yet"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Weakest subject</p>
              <p className="mt-1 text-sm text-muted-foreground">{weakSubject ? `${weakSubject.subject} (${weakSubject.averageScore}%)` : "No data yet"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 px-4 py-3 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Focus tip</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">If attendance stays strong, the score gap is usually the fastest lever to close with one small intervention.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Subjects</Badge>} description="A bar chart plus score cards gives the class an at-a-glance teaching story.">
            Subject performance
          </SectionTitle>
          <div className="h-72">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={subjectScores} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16 }} />
                  <Bar dataKey="averageScore" radius={[10, 10, 0, 0]} fill="var(--brand-600)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Stable</Badge>}>Teaching summary</SectionTitle>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Top subject</p>
              <p className="mt-1 text-sm text-muted-foreground">{topSubject ? `${topSubject.subject} (${topSubject.averageScore}%)` : "No data yet"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Focus subject</p>
              <p className="mt-1 text-sm text-muted-foreground">{weakSubject ? `${weakSubject.subject} (${weakSubject.averageScore}%)` : "No data yet"}</p>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Attendance band</span>
                <span className="text-muted-foreground">{analytics?.attendance_rate ?? 0}%</span>
              </div>
              <ProgressBar value={analytics?.attendance_rate ?? 0} tone="success" />
            </div>
            {isError && <p className="text-sm text-danger">Failed to load class analytics.</p>}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{subjectScores.length} subjects</Badge>} description="Score cards with more spacing and a more refined state when data is missing.">
          Subject score overview
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {subjectScores.map((item) => (
            <div key={item.subject} className="rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.entries} assessment(s)</p>
                </div>
                <span className="text-lg font-bold text-foreground">{item.averageScore}%</span>
              </div>
              <div className="mt-4">
                <ProgressBar value={item.averageScore} tone={item.averageScore >= 80 ? "success" : item.averageScore >= 65 ? "brand" : "warning"} />
              </div>
            </div>
          ))}
          {!isLoading && !isError && subjectScores.length === 0 && (
            <EmptyState title="No subject insights available" description="Once enough marks are recorded, the class score overview will appear here." icon={BarChart3} />
          )}
        </div>
      </Card>
    </div>
  );
}