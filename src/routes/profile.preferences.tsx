import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, ShieldCheck, BellRing } from "lucide-react";
import { Badge, Card, PageHeader, PrimaryButton, SecondaryButton, SectionTitle } from "@/components/app/ui-bits";
import { useRole } from "@/components/app/role-context";
import { useProfile, useUpdateProfile } from "@/hooks/api-hooks";
import { logout } from "@/lib/auth";

export const Route = createFileRoute("/profile/preferences")({
  head: () => ({ meta: [{ title: "Preferences — AetherLMS" }] }),
  component: PreferencesPage,
});

type PreferencesFormState = {
  email_notifications: boolean;
  sms_notifications: boolean;
  weekly_digest: boolean;
};

function PreferencesPage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { data: profile, isLoading } = useProfile(role);
  const updateProfile = useUpdateProfile(role);

  const initialState = useMemo<PreferencesFormState>(
    () => ({
      email_notifications: profile?.email_notifications ?? true,
      sms_notifications: profile?.sms_notifications ?? false,
      weekly_digest: profile?.weekly_digest ?? true,
    }),
    [profile],
  );

  const [form, setForm] = useState<PreferencesFormState>(initialState);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm(initialState);
    setDirty(false);
  }, [initialState]);

  function updateField<K extends keyof PreferencesFormState>(key: K, value: PreferencesFormState[K]) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
    setDirty(true);
  }

  async function saveProfile() {
    await updateProfile.mutateAsync(form);
    setDirty(false);
  }

  function signOut() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Notification center"
        title="Preferences"
        subtitle="Control how updates are delivered so the right people receive the right messages."
        actions={
          <>
            {isLoading && <Badge tone="warning">Loading profile</Badge>}
            <Badge tone="brand"><ShieldCheck className="mr-1 inline size-3" />Saved securely</Badge>
            <PrimaryButton onClick={saveProfile} disabled={updateProfile.isPending || !dirty}>
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </PrimaryButton>
            <SecondaryButton onClick={signOut}><LogOut className="size-4" />Sign out</SecondaryButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Messages</Badge>} description="Choose which notifications should be delivered and how often.">
            Delivery preferences
          </SectionTitle>
          <div className="space-y-3 rounded-2xl border border-border/70 bg-secondary/25 p-4 text-sm">
            {[
              ["email_notifications", "Email notifications", "Receive routine updates and reminders by email."],
              ["sms_notifications", "SMS notifications", "Use SMS for urgent alerts only."],
              ["weekly_digest", "Weekly digest", "Receive a weekly summary of recent activity."],
            ].map(([key, label, detail]) => (
              <label key={key} className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-card px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
                </div>
                <input type="checkbox" checked={form[key as keyof PreferencesFormState] as boolean} onChange={(event) => updateField(key as keyof PreferencesFormState, event.target.checked as never)} className="mt-1 size-4 rounded border-border/70" />
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Guidance</Badge>} description="Use these settings to keep communication clear and manageable.">
            Recommended use
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Email first</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Best for routine notices, summaries, and platform updates.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BellRing className="size-4 text-brand-600" />
                SMS for urgent items
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Reserve SMS for attendance concerns, urgent reminders, and approvals.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
