import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, Clock3, ReceiptText, Sparkles, Wallet } from "lucide-react";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, SectionTitle, Badge, PrimaryButton, SecondaryButton, ProgressBar } from "@/components/app/ui-bits";

export const Route = createFileRoute("/accounts/")({
  head: () => ({ meta: [{ title: "Accounts Dashboard — AetherLMS" }] }),
  component: AccountsDashboardPage,
});

function AccountsDashboardPage() {
  const revenue = [
    { month: "Jan", value: 78 },
    { month: "Feb", value: 80 },
    { month: "Mar", value: 82 },
    { month: "Apr", value: 84 },
    { month: "May", value: 88 },
    { month: "Jun", value: 91 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Finance command center"
        title="Financial Ledger"
        subtitle="A calmer finance module with transaction analytics, payment status, revenue trends, and verification-friendly workflows."
        actions={
          <>
            <Badge tone="success"><BadgeCheck className="mr-1 inline size-3" />UPI verified</Badge>
            <PrimaryButton>Record payment</PrimaryButton>
            <SecondaryButton>Export ledger</SecondaryButton>
          </>
        }
      />

      <Card className="p-5">
        <SectionTitle action={<Badge tone="brand">Shortcuts</Badge>} description="The finance workspace works better when the next action is obvious.">
          Finance shortcuts
        </SectionTitle>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            {[
              "Record a payment and issue a receipt",
              "Send overdue reminders to parents",
              "Export the ledger for reconciliation",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3 text-sm text-foreground">
                {item}
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-3xl border border-border/70 bg-brand-50/50 p-4 dark:bg-brand-500/10">
            <p className="text-sm font-semibold text-foreground">Ledger watch</p>
            <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
              <li>Prioritize overdue recovery before new entries.</li>
              <li>Keep UPI transaction IDs visible for audits.</li>
              <li>Use the export action when reconciliation is due.</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Revenue trend</Badge>} description="A clean month-over-month trend line for leadership and finance teams.">
            Revenue overview
          </SectionTitle>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Area type="monotone" dataKey="value" stroke="var(--success)" fill="url(#revenueFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle action={<Badge tone="warning">Overdue</Badge>}>Payment health</SectionTitle>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Current term collection</span>
                  <span className="text-muted-foreground">94%</span>
                </div>
                <ProgressBar value={94} tone="success" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Overdue recovery</span>
                  <span className="text-muted-foreground">71%</span>
                </div>
                <ProgressBar value={71} tone="warning" />
              </div>
              <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
                <p className="text-sm font-semibold text-foreground">Finance note</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">UPI verification is active across most transactions, reducing manual review and speeding up reconciliation.</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle action={<Badge tone="brand">Quick actions</Badge>}>Finance tools</SectionTitle>
            <div className="space-y-3">
              {[
                "Print receipt batch",
                "Export transaction audit",
                "Verify UPI payments",
                "Send overdue reminders",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{item}</p>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}