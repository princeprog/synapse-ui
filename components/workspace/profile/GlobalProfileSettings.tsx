"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation } from "@/hooks/mutation/auth/useUpdateProfileMutation";
import { useProfileQuery } from "@/hooks/queries/auth/useProfileQuery";

type ProfileFormState = {
  displayName: string;
  username: string;
  email: string;
  avatarUrl: string;
  timeZone: string;
};

export default function GlobalProfileSettings() {
  const { data: profile, isLoading, error } = useProfileQuery();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfileMutation();
  const [formOverrides, setFormOverrides] = useState<Partial<ProfileFormState>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const form = useMemo<ProfileFormState>(() => {
    const fromProfile: ProfileFormState = {
      displayName:
        profile?.displayName ||
        [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
        "",
      username: profile?.username || "",
      email: profile?.email || "",
      avatarUrl: profile?.avatarUrl || "",
      timeZone: profile?.timeZone || "",
    };

    return {
      displayName: formOverrides.displayName ?? fromProfile.displayName,
      username: formOverrides.username ?? fromProfile.username,
      email: formOverrides.email ?? fromProfile.email,
      avatarUrl: formOverrides.avatarUrl ?? fromProfile.avatarUrl,
      timeZone: formOverrides.timeZone ?? fromProfile.timeZone,
    };
  }, [formOverrides, profile]);

  const initials = useMemo(() => {
    const source = form.displayName || form.username || "User";

    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((value) => value[0]?.toUpperCase() ?? "")
      .join("");
  }, [form.displayName, form.username]);

  const handleInputChange = (field: keyof ProfileFormState, value: string) => {
    setFormOverrides((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const uploadedAvatar = typeof reader.result === "string" ? reader.result : "";
      handleInputChange("avatarUrl", uploadedAvatar);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile?.id) {
      setActionError("Unable to save profile: user id is missing.");
      return;
    }

    setActionError(null);
    setActionMessage(null);

    updateProfile(
      {
        userId: profile.id,
        payload: {
          displayName: form.displayName.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          avatarUrl: form.avatarUrl.trim() || null,
          timeZone: form.timeZone.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setActionMessage("Profile updated successfully.");
        },
        onError: (mutationError) => {
          setActionError(mutationError.message);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10 md:px-8">
        <p className="text-sm text-slate-500">Loading your profile settings...</p>
      </main>
    );
  }

  if (error instanceof Error) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10 md:px-8">
        <p className="text-sm text-red-600" role="alert">
          {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10 md:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Global Profile Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the personal details that are displayed across your Synapse account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-3 rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Profile Avatar</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 rounded-xl">
                <AvatarImage src={form.avatarUrl} alt={form.displayName || form.username || "User avatar"} />
                <AvatarFallback className="rounded-xl">{initials || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  type="url"
                  value={form.avatarUrl}
                  onChange={(event) => handleInputChange("avatarUrl", event.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="avatar-upload">Or upload avatar</Label>
              <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} />
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Public Identity</h2>
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={form.displayName}
                onChange={(event) => handleInputChange("displayName", event.target.value)}
                placeholder="How your name appears in the app"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(event) => handleInputChange("username", event.target.value)}
                placeholder="Unique username"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email Address</Label>
                <span
                  className={
                    profile?.emailVerified
                      ? "rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                      : "rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"
                  }
                >
                  {profile?.emailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => handleInputChange("email", event.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={form.timeZone}
                onChange={(event) => handleInputChange("timeZone", event.target.value)}
                placeholder="e.g. Asia/Manila"
                list="timezone-options"
              />
              <datalist id="timezone-options">
                <option value="UTC" />
                <option value="Asia/Manila" />
                <option value="Asia/Singapore" />
                <option value="Asia/Tokyo" />
                <option value="Europe/London" />
                <option value="Europe/Paris" />
                <option value="America/New_York" />
                <option value="America/Los_Angeles" />
              </datalist>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Password</h2>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-sm text-slate-600">********</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActionMessage("Use the upcoming change password flow to update your password.")}
              >
                Change Password
              </Button>
            </div>
          </section>

          {actionError && (
            <p className="text-sm text-red-600" role="alert">
              {actionError}
            </p>
          )}

          {actionMessage && <p className="text-sm text-emerald-700">{actionMessage}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
