import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Sparkles } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, EmptyState } from "@/components/app/ui-bits";
import { resolveParentStudentId } from "@/lib/defaults";
import { useNotifications } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/parent/notifications")({
  head: () => ({ meta: [{ title: "Parent Notifications — AetherLMS" }] }),
  component: ParentNotificationsPage,
});

function ParentNotificationsPage() {
  const studentId = resolveParentStudentId(null);
  const { data: notifications, isLoading, isError } = useNotifications(studentId);
  const items = notifications ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Parent notifications"
        title="Notifications"
        subtitle={`Alerts for ${studentId} with clearer severity hints and a calmer, easier-to-scan presentation.`}
        actions={<Badge tone="brand">{items.length} alerts</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,1.15fr)]">
        <StatCard label="Alerts" value={String(items.length)} delta="All types" icon={BellRing} sparkline={[1, 2, 2, 3, 3, 4, 4]} caption="Current parent-facing alerts in the inbox." />
        <StatCard label="Unseen" value={String(items.filter((item) => !item.read).length)} delta="Unread" deltaTone="negative" icon={Sparkles} sparkline={[1, 1, 2, 2, 2, 2, 2]} caption="Unread notifications need a quick glance." />
        <Card className="p-5 md:col-span-2 xl:col-span-1">
          <SectionTitle action={<Badge tone="brand">Priority</Badge>} description="Scan top-down: urgent first, then unread, then everything else.">
            Inbox filters
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3 text-sm text-foreground">
              Start with unread alerts that mention attendance, fees, or meetings.
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 px-4 py-3 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Parent tip</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Reply to the teacher directly when an alert needs clarification.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">Inbox</Badge>} description="A list view that feels more intentional and easier for parents to read.">
          Latest alerts
        </SectionTitle>
        <div className="space-y-3">
          {isLoading && <Skeleton className="h-14 w-full rounded-2xl" />}
          {isError && <p className="text-sm text-danger">Failed to load notifications.</p>}
          {items.map((notification) => (
            <Card key={notification.notification_id} className="p-4" hoverable>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                <Badge tone={notification.severity}>{notification.type}</Badge>
              </div>
            </Card>
          ))}
          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No notifications found" description="When school updates arrive, they will appear here with a calm and easy-to-scan layout." icon={BellRing} />
          )}
        </div>
      </Card>
    </div>
  );
}