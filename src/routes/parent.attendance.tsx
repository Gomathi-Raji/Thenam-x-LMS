import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ShieldCheck, CalendarDays, TrendingUp } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar } from "@/components/app/ui-bits";
import { resolveParentStudentId } from "@/lib/defaults";
import { useAttendance } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/parent/attendance")({
  head: () => ({ meta: [{ title: "Parent Attendance — AetherLMS" }] }),
  component: ParentAttendancePage,
});

function ParentAttendancePage() {
  const studentId = resolveParentStudentId(null);
  const { data: attendance, isLoading, isError } = useAttendance(studentId);

  const stats = useMemo(() => {
    const total = attendance?.length ?? 0;
    const present = attendance?.filter((record) => record.status === "present").length ?? 0;
    return { total, present, percent: total ? Math.round((present / total) * 100) : 0 };
  }, [attendance]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Parent attendance"
        title="Attendance"
        subtitle={`Child record for ${studentId} with a calmer summary and a more reassuring presentation.`}
        actions={<Badge tone="brand">Latest records</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,1.15fr)]">
        <StatCard label="Total" value={String(stats.total)} delta="Sessions" icon={CalendarDays} sparkline={[4, 5, 6, 7, 8, 8, 9]} caption="All attendance records currently available." />
        <StatCard label="Present" value={String(stats.present)} delta="Strong" deltaTone="positive" icon={ShieldCheck} sparkline={[4, 4, 5, 6, 7, 8, 8]} caption="A healthy number of attended sessions." />
        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Home rhythm</Badge>} description="Use the record list to keep a calm routine at home, not to chase every detail.">
            At-home guide
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3 text-sm text-foreground">
              A short nightly check-in keeps the attendance pattern strong.
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 px-4 py-3 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Helpful signal</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">If a missed session appears, review it early with your child and the teacher.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Latest records</Badge>} description="A softer session log with a more polished summary and a clean record list.">
            Session log
          </SectionTitle>
          <div className="space-y-3">
            {isLoading && <Skeleton className="h-12 w-full rounded-2xl" />}
            {isError && <p className="text-sm text-danger">Failed to load attendance.</p>}
            {(attendance ?? []).slice(0, 6).map((record) => (
              <div key={`${record.student_id}-${record.date}`} className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/20 p-4 text-sm">
                <span>{new Date(record.date).toLocaleDateString()}</span>
                <Badge tone={record.status === "present" ? "success" : "danger"}>{record.status}</Badge>
              </div>
            ))}
            {!isLoading && !isError && (attendance ?? []).length === 0 && <p className="text-sm text-muted-foreground">No attendance found.</p>}
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Calm</Badge>}>Attendance summary</SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Attendance rate</span>
                <span className="text-muted-foreground">{stats.percent}%</span>
              </div>
              <ProgressBar value={stats.percent} tone="success" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Parent guidance</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Attendance is solid enough to stay on a steady routine. A simple nightly check-in can keep the pattern strong.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}