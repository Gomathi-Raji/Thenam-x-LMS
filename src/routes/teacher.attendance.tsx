import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Users, ShieldCheck } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, ProgressBar, PrimaryButton, SecondaryButton } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useClassAttendance, useCreateAttendance, useStudentsByClass } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher/attendance")({
  head: () => ({ meta: [{ title: "Teacher Attendance — AetherLMS" }] }),
  component: TeacherAttendancePage,
});

function TeacherAttendancePage() {
  const classId = resolveTeacherClassId();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statusMap, setStatusMap] = useState<Record<string, "present" | "absent">>({});
  const { data: attendance, isLoading } = useClassAttendance(classId);
  const { data: students } = useStudentsByClass(classId);
  const markMutation = useCreateAttendance();

  const todaysRows = useMemo(() => {
    return (students ?? []).map((student) => ({
      student_id: student.student_id,
      name: student.name,
      status: statusMap[student.student_id] ?? "present",
    }));
  }, [statusMap, students]);

  const presentCount = todaysRows.filter((row) => row.status === "present").length;
  const absentCount = todaysRows.filter((row) => row.status === "absent").length;

  const submitAttendance = () => {
    todaysRows.forEach((row) => {
      markMutation.mutate({ student_id: row.student_id, class_id: classId, date, status: row.status });
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher attendance"
        title="Class Attendance"
        subtitle={`Live class log for ${classId} with faster marking, clearer summaries, and cleaner visual grouping.`}
        actions={<Badge tone="brand">Mark attendance</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Mark once</Badge>} description="Keep attendance fast: mark, review, and save in a single pass.">
            Marking flow
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Class size</p>
                    <p className="mt-1 text-sm text-muted-foreground">{todaysRows.length} students on the roster</p>
                  </div>
                  <Badge tone="brand">Today</Badge>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{presentCount}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="rounded-2xl border border-border/70 p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{absentCount}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Quick tools</p>
              <div className="grid gap-2">
                <PrimaryButton type="button" onClick={submitAttendance} disabled={markMutation.isPending}>Save attendance</PrimaryButton>
                <SecondaryButton type="button">Send parent note</SecondaryButton>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">Use the date picker above for the correct session, then save once after the full class is marked.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Snapshot</Badge>} description="A short read on how today’s marking is going.">
            Session summary
          </SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Present</span>
                <span className="text-muted-foreground">{presentCount}</span>
              </div>
              <ProgressBar value={todaysRows.length ? (presentCount / todaysRows.length) * 100 : 0} tone="success" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Absent</span>
                <span className="text-muted-foreground">{absentCount}</span>
              </div>
              <ProgressBar value={todaysRows.length ? (absentCount / todaysRows.length) * 100 : 0} tone="warning" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4 text-sm leading-6 text-muted-foreground">
              Start with any absent student, then use the same flow for the rest of the class so the audit trail stays consistent.
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Mark attendance</Badge>} description="A smoother attendance grid with clearer selectors and a stronger save affordance.">
            Today
          </SectionTitle>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            <PrimaryButton type="button" onClick={submitAttendance} disabled={markMutation.isPending}>
              {markMutation.isPending ? "Saving..." : "Save attendance"}
            </PrimaryButton>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {todaysRows.map((row) => (
              <div key={row.student_id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/20 p-4 text-sm">
                <span className="font-medium text-foreground">{row.name}</span>
                <select
                  value={row.status}
                  onChange={(e) => setStatusMap((prev) => ({ ...prev, [row.student_id]: e.target.value as "present" | "absent" }))}
                  className="rounded-xl border border-border/70 bg-card px-3 py-2"
                >
                  <option value="present">present</option>
                  <option value="absent">absent</option>
                </select>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Stable</Badge>}>Session summary</SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Present</span>
                <span className="text-muted-foreground">{presentCount}</span>
              </div>
              <ProgressBar value={todaysRows.length ? (presentCount / todaysRows.length) * 100 : 0} tone="success" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Absent</span>
                <span className="text-muted-foreground">{absentCount}</span>
              </div>
              <ProgressBar value={todaysRows.length ? (absentCount / todaysRows.length) * 100 : 0} tone="warning" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Workflow tip</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Mark the whole row in one pass, then save once. This keeps the workflow fast while preserving a clean audit trail.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{attendance?.length ?? 0} records</Badge>} description="A cleaner history table with a more polished visual hierarchy.">
          Attendance log
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                    Loading attendance...
                  </td>
                </tr>
              )}
              {!isLoading && (attendance ?? []).length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                    No attendance records found.
                  </td>
                </tr>
              )}
              {(attendance ?? []).map((record) => (
                <tr key={`${record.student_id}-${record.date}`} className="transition hover:bg-secondary/30">
                  <td className="px-4 py-3">{record.student_id}</td>
                  <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}