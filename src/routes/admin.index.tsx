import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BadgeAlert,
  BellRing,
  ClipboardCheck,
  GraduationCap,
  Landmark,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Badge,
  Card,
  PageHeader,
  SectionTitle,
  PrimaryButton,
  SecondaryButton,
  ProgressBar,
} from "@/components/app/ui-bits";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — AetherLMS" }] }),
  component: AdminDashboardPage,
});

const alerts = [
  { title: "Fee collections are 94% on track", detail: "Most sections are above target for this term.", tone: "success" as const },
  { title: "Attendance dip in Grade 10-B", detail: "A one-click intervention can be sent to teachers and parents.", tone: "warning" as const },
  { title: "2 staff profiles need review", detail: "Role and timetable updates are pending approval.", tone: "brand" as const },
];

const activity = [
  { label: "Admissions updated", time: "8 min ago" },
  { label: "Weekly report generated", time: "22 min ago" },
  { label: "Staff timetable synced", time: "1 hr ago" },
  { label: "Parent alerts delivered", time: "3 hr ago" },
];

function AdminDashboardPage() {
  const departmentData = [
    { name: "Academics", score: 92 },
    { name: "Operations", score: 88 },
    { name: "Finance", score: 95 },
    { name: "Student Care", score: 89 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Institution overview"
        title="Admin Dashboard"
        subtitle="A clear leadership overview that brings attendance, academics, finance, and alerts together in one workspace."
        actions={
          <>
            <Badge tone="success"><BellRing className="mr-1 inline size-3" />Live sync</Badge>
            <PrimaryButton><Sparkles className="size-4" />Generate report</PrimaryButton>
            <SecondaryButton>Export PDF</SecondaryButton>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="warning">Needs attention</Badge>} description="Use this list to review and approve the most important operational items first.">
            Priority actions
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-3">
              {[
                { title: "Review attendance dips in Grade 10-B", note: "Create a teacher follow-up and parent update." },
                { title: "Approve the fee recovery batch", note: "Release once the finance lead signs off." },
                { title: "Review staff profile updates", note: "Check records needing designation changes." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3 text-sm text-foreground">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Fast path</p>
              <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                <p>Use the queue for decisions instead of scanning a fourth summary card.</p>
                <p>Broadcast one leadership update instead of sending three separate messages.</p>
              </div>
              <div className="grid gap-2 pt-1">
                <button className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-brand-300">
                  Review now
                </button>
                <button className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-brand-300">
                  Send update
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Today</Badge>} description="A concise view of the day’s priorities and approvals.">
            Daily overview
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3 text-sm text-foreground">
              <p className="font-medium">Morning check-in</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Attendance review and late entry monitoring before first period.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3 text-sm text-foreground">
              <p className="font-medium">Afternoon approval</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Finance batch and staff profile updates need leadership sign-off.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 px-4 py-3 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Quick actions</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-brand-300">
                  Open reports
                </button>
                <button className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-brand-300">
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card>
          <SectionTitle
            description="Weekly overview across attendance, academics, and financial operations."
            action={<Badge tone="brand">Last 7 days</Badge>}
          >
            Institutional Overview
          </SectionTitle>
          <div className="h-[340px] px-2 py-4 md:px-4">
            <ResponsiveContainer>
              <AreaChart
                data={[
                  { day: "Mon", attendance: 91, revenue: 74 },
                  { day: "Tue", attendance: 92, revenue: 77 },
                  { day: "Wed", attendance: 93, revenue: 79 },
                  { day: "Thu", attendance: 94, revenue: 81 },
                  { day: "Fri", attendance: 95, revenue: 84 },
                  { day: "Sat", attendance: 96, revenue: 86 },
                  { day: "Sun", attendance: 96, revenue: 87 },
                ]}
              >
                <defs>
                  <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-500)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--brand-500)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "0 16px 36px -24px rgba(15,23,42,0.35)" }} />
                <Area type="monotone" dataKey="attendance" stroke="var(--brand-600)" fill="url(#attendanceFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="revenue" stroke="var(--success)" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle action={<Badge tone="warning">Needs attention</Badge>}>Alert Center</SectionTitle>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.title} className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{alert.detail}</p>
                    </div>
                    <Badge tone={alert.tone}>{alert.tone}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle action={<Badge tone="brand">Timeline</Badge>}>Activity Feed</SectionTitle>
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Department score</Badge>}>Performance by Department</SectionTitle>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={departmentData} layout="vertical" margin={{ left: 10, right: 12 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} width={120} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Bar dataKey="score" radius={[0, 12, 12, 0]} fill="var(--brand-600)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Healthy</Badge>}>Operational Snapshot</SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Academic delivery</span>
                <span className="text-muted-foreground">92%</span>
              </div>
              <ProgressBar value={92} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Finance collection</span>
                <span className="text-muted-foreground">94%</span>
              </div>
              <ProgressBar value={94} tone="success" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Student wellbeing</span>
                <span className="text-muted-foreground">89%</span>
              </div>
              <ProgressBar value={89} tone="brand" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Leadership summary</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The school is operating in a stable range. Attendance and finance are both trending upward while two academic interventions remain top priority.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}