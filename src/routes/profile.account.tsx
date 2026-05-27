import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { Badge, Card, PageHeader, PrimaryButton, SecondaryButton, SectionTitle } from "@/components/app/ui-bits";
import { useRole } from "@/components/app/role-context";
import { useProfile, useUpdateProfile } from "@/hooks/api-hooks";
import { logout } from "@/lib/auth";

export const Route = createFileRoute("/profile/account")({
  head: () => ({ meta: [{ title: "Account Profile — AetherLMS" }] }),
  component: AccountProfilePage,
});

type AccountFormState = {
  display_name: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

function AccountProfilePage() {
  const navigate = useNavigate();
  const { role, current } = useRole();
  const { data: profile, isLoading } = useProfile(role);
  const updateProfile = useUpdateProfile(role);

  const initialState = useMemo<AccountFormState>(
    () => ({
      display_name: profile?.display_name ?? current.person,
      subtitle: profile?.subtitle ?? current.subtitle,
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      location: profile?.location ?? "",
      bio: profile?.bio ?? "",
    }),
    [current.person, current.subtitle, profile],
  );

  const [form, setForm] = useState<AccountFormState>(initialState);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm(initialState);
    setDirty(false);
  }, [initialState]);

  function updateField<K extends keyof AccountFormState>(key: K, value: AccountFormState[K]) {
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
        eyebrow="Account center"
        title="Account Profile"
        subtitle="Update the details that appear across the platform for staff, parents, and students."
        actions={
          <>
            {isLoading && <Badge tone="warning">Loading profile</Badge>}
            <Badge tone="brand"><ShieldCheck className="mr-1 inline size-3" />Profile saved securely</Badge>
            <PrimaryButton onClick={saveProfile} disabled={updateProfile.isPending || !dirty}>
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </PrimaryButton>
            <SecondaryButton onClick={signOut}><LogOut className="size-4" />Sign out</SecondaryButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <SectionTitle action={<Badge tone="brand">Profile</Badge>} description="Keep the visible identity details consistent across the LMS.">
            Personal details
          </SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-1">
              <span className="text-sm font-medium text-foreground">Display name</span>
              <input value={form.display_name} onChange={(event) => updateField("display_name", event.target.value)} className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 md:col-span-1">
              <span className="text-sm font-medium text-foreground">Role subtitle</span>
              <input value={form.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 md:col-span-1">
              <span className="text-sm font-medium text-foreground">Email</span>
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 md:col-span-1">
              <span className="text-sm font-medium text-foreground">Phone</span>
              <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Location</span>
              <input value={form.location} onChange={(event) => updateField("location", event.target.value)} className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">Bio</span>
              <textarea value={form.bio} onChange={(event) => updateField("bio", event.target.value)} rows={4} className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            </label>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<Badge tone="success">Summary</Badge>} description="The current profile preview used by the rest of the platform.">
            Profile summary
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Current user</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{form.display_name}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Account role</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{role}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Next step</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Use Workspace Settings to control layout, theme, and landing page preferences.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
