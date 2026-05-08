"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileQuery } from "@/hooks/queries/auth/useProfileQuery";
import { useWorkspacesQuery } from "@/hooks/queries/workspaces/useWorkspacesQuery";
import { useWorkspaceMembersQuery } from "@/hooks/queries/workspaces/useWorkspaceMembersQuery";
import { useUpdateWorkspaceMemberProfileMutation } from "@/hooks/mutation/workspaces/useUpdateWorkspaceMemberProfileMutation";

type WorkspaceProfileFormState = {
  workspaceDisplayName: string;
  jobTitle: string;
};

type WorkspaceProfileSettingsProps = {
  workspaceSlug?: string;
  showWorkspacePicker?: boolean;
};

export default function WorkspaceProfileSettings({
  workspaceSlug,
  showWorkspacePicker = false,
}: WorkspaceProfileSettingsProps) {
  const { data: profile, isLoading: isProfileLoading, error: profileError } =
    useProfileQuery();
  const {
    data: workspaces = [],
    isLoading: isWorkspacesLoading,
    error: workspacesError,
  } = useWorkspacesQuery(showWorkspacePicker);
  const [selectedSlug, setSelectedSlug] = useState(workspaceSlug ?? "");
  const {
    mutate: updateMemberProfile,
    isPending: isSaving,
  } = useUpdateWorkspaceMemberProfileMutation();
  const [formOverrides, setFormOverrides] =
    useState<Partial<WorkspaceProfileFormState>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceSlug && workspaceSlug !== selectedSlug) {
      setSelectedSlug(workspaceSlug);
      return;
    }

    if (!showWorkspacePicker || selectedSlug || workspaces.length === 0) {
      return;
    }

    setSelectedSlug(workspaces[0].slug);
  }, [selectedSlug, showWorkspacePicker, workspaceSlug, workspaces]);

  const activeWorkspaceSlug = showWorkspacePicker ? selectedSlug : workspaceSlug || "";
  const activeWorkspace = useMemo(() => {
    if (!activeWorkspaceSlug) {
      return null;
    }

    return workspaces.find((workspace) => workspace.slug === activeWorkspaceSlug) || null;
  }, [activeWorkspaceSlug, workspaces]);

  const {
    data: members = [],
    isLoading: isMembersLoading,
    error: membersError,
  } = useWorkspaceMembersQuery(activeWorkspaceSlug);

  const currentMember = useMemo(() => {
    if (!profile?.id) {
      return null;
    }

    return members.find((member) => member.userId === profile.id) || null;
  }, [members, profile?.id]);

  const fallbackDisplayName = useMemo(() => {
    if (!profile) {
      return "";
    }

    return (
      profile.displayName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      profile.username ||
      ""
    );
  }, [profile]);

  const form = useMemo<WorkspaceProfileFormState>(() => {
    const fromMember: WorkspaceProfileFormState = {
      workspaceDisplayName: currentMember?.workspaceDisplayName || fallbackDisplayName,
      jobTitle: currentMember?.jobTitle || "",
    };

    return {
      workspaceDisplayName:
        formOverrides.workspaceDisplayName ?? fromMember.workspaceDisplayName,
      jobTitle: formOverrides.jobTitle ?? fromMember.jobTitle,
    };
  }, [currentMember, fallbackDisplayName, formOverrides]);

  const handleInputChange = (field: keyof WorkspaceProfileFormState, value: string) => {
    setFormOverrides((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile?.id) {
      setActionError("Unable to save workspace profile: user id is missing.");
      return;
    }

    if (!activeWorkspaceSlug) {
      setActionError("Select a workspace to update your workspace profile.");
      return;
    }

    setActionError(null);
    setActionMessage(null);

    updateMemberProfile(
      {
        workspaceSlug: activeWorkspaceSlug,
        memberId: profile.id,
        payload: {
          workspaceDisplayName: form.workspaceDisplayName.trim() || undefined,
          jobTitle: form.jobTitle.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setActionMessage("Workspace profile updated successfully.");
        },
        onError: (mutationError) => {
          setActionError(mutationError.message);
        },
      },
    );
  };

  if (profileError instanceof Error) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-red-600" role="alert">
          {profileError.message}
        </p>
      </section>
    );
  }

  if (showWorkspacePicker && workspacesError instanceof Error) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-red-600" role="alert">
          {workspacesError.message}
        </p>
      </section>
    );
  }

  const isLoading = isProfileLoading || (showWorkspacePicker && isWorkspacesLoading);

  const isSubmitDisabled = isSaving || isMembersLoading || !currentMember;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Workspace Profile Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Customize how you appear inside a specific workspace.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-500">Loading workspace profile settings...</p>
      )}

      {!isLoading && showWorkspacePicker && workspaces.length === 0 && (
        <p className="text-sm text-slate-500">
          Join or create a workspace to customize your workspace profile.
        </p>
      )}

      {!isLoading && showWorkspacePicker && workspaces.length > 0 && (
        <div className="mb-5 space-y-2">
          <Label htmlFor="workspace-select">Workspace</Label>
          <Select value={activeWorkspaceSlug} onValueChange={setSelectedSlug}>
            <SelectTrigger id="workspace-select" className="w-full">
              <SelectValue placeholder="Select a workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.slug}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!isLoading && activeWorkspaceSlug && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="workspace-display-name">
              Workspace Display Name
            </Label>
            <Input
              id="workspace-display-name"
              value={form.workspaceDisplayName}
              onChange={(event) =>
                handleInputChange("workspaceDisplayName", event.target.value)
              }
              placeholder="Name shown to workspace members"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-job-title">Job Title</Label>
            <Input
              id="workspace-job-title"
              value={form.jobTitle}
              onChange={(event) => handleInputChange("jobTitle", event.target.value)}
              placeholder="e.g. Lead Engineer"
            />
          </div>

          {membersError instanceof Error && (
            <p className="text-sm text-red-600" role="alert">
              {membersError.message}
            </p>
          )}

          {isMembersLoading && (
            <p className="text-sm text-slate-500">Loading workspace member data...</p>
          )}

          {!membersError && !isMembersLoading && !currentMember && (
            <p className="text-sm text-slate-500">
              You are not listed as a member of this workspace.
            </p>
          )}

          {actionError && (
            <p className="text-sm text-red-600" role="alert">
              {actionError}
            </p>
          )}

          {actionMessage && <p className="text-sm text-emerald-700">{actionMessage}</p>}

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              {activeWorkspace?.name
                ? `Editing: ${activeWorkspace.name}`
                : "Workspace selected"}
            </span>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isSaving ? "Saving..." : "Save Workspace Profile"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
