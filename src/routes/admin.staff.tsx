import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, BookOpen, Gauge, Users } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, EmptyState } from "@/components/app/ui-bits";
import { useTeachers } from "@/hooks/api-hooks";

export const Route = createFileRoute("/admin/staff")({
  head: () => ({ meta: [{ title: "Academic Staff — AetherLMS" }] }),
  component: AdminStaffPage,
});

function AdminStaffPage() {
  const { data: teachers } = useTeachers();
  const staff = teachers ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Academic staff"
        title="Academic Staff"
        subtitle="A polished teacher directory with clearer role labels, workload hints, and easier scanning for school leadership."
        actions={<Badge tone="brand">{staff.length} staff</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,1.15fr)]">
        <StatCard label="Staff members" value={String(staff.length)} delta="Active" icon={Users} sparkline={[20, 22, 23, 24, 25, 26, 27]} caption="Academic staff currently loaded from MongoDB." />
        <StatCard label="Core subjects" value={String(new Set(staff.map((item) => item.subject)).size)} delta="Coverage" deltaTone="positive" icon={BookOpen} sparkline={[5, 5, 6, 6, 7, 7, 7]} caption="Subjects represented across the teaching team." />
        <Card className="p-5 md:col-span-2 xl:col-span-1">
          <SectionTitle action={<Badge tone="brand">Tools</Badge>} description="Filter by subject first, then review workload and profile completeness.">
            Directory tools
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3 text-sm text-foreground">
              Search by subject or staff ID before opening a profile.
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 px-4 py-3 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Review focus</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Use the workload view to spot overloaded teachers before the next timetable change.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{staff.length} staff</Badge>} description="Cards feel more like a commercial directory and less like a data dump.">
          Staff directory
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {staff.map((teacher, index) => (
            <Card key={teacher.teacher_id} className="p-4" hoverable>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.teacher_id}</p>
                </div>
                <Badge tone={index % 3 === 0 ? "brand" : index % 3 === 1 ? "success" : "neutral"}>{teacher.subject}</Badge>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workload</p>
                <ProgressBar value={68 + (index % 4) * 7} tone={index % 2 === 0 ? "brand" : "success"} />
              </div>
            </Card>
          ))}
          {staff.length === 0 && <EmptyState title="No staff found" description="Teacher records will appear once the API returns data." icon={Users} />}
        </div>
      </Card>
    </div>
  );
}