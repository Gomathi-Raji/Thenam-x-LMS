import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck, Clock3 } from "lucide-react";
import { Badge, Card, PageHeader, PrimaryButton, SecondaryButton, SectionTitle } from "@/components/app/ui-bits";
import { useRole } from "@/components/app/role-context";
import { useProfile, useProfileActivity } from "@/hooks/api-hooks";
import { logout } from "@/lib/auth";

export const Route = createFileRoute("/profile/activity")({
  head: () => ({ meta: [{ title: "Recent Activity — AetherLMS" }] }),
  component: ActivityPage,
});

function ActivityPage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { data: profile, isLoading } = useProfile(role);
  const { data: activity } = useProfileActivity(role);
  const recentActivity = Array.isArray(activity) ? activity : Array.isArray(profile?.recent_activity) ? profile.recent_activity : [];

  function signOut() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Activity center"
        title="Recent Activity"
        subtitle="Review recent profile and workspace changes in a simple timeline."
        actions={
          <>
            {isLoading && <Badge tone="warning">Loading profile</Badge>}
            <Badge tone="brand"><ShieldCheck className="mr-1 inline size-3" />Activity synced</Badge>
            <SecondaryButton onClick={signOut}><LogOut className="size-4" />Sign out</SecondaryButton>
          </>
        }
      />

      <Card className="p-5">
        <SectionTitle action={<Badge tone="brand">Timeline</Badge>} description="A straightforward record of the latest profile-related updates.">
          Activity feed
        </SectionTitle>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={`${item.title}-${item.at}`} className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                </div>
                <Badge tone={item.tone}>{item.tone}</Badge>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock3 className="size-4 text-brand-600" />
                No recent activity yet
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Profile changes and workspace updates will appear here once they are saved.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
