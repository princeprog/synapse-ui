"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Hash, Plus } from "lucide-react";

import { Button } from "@/components/common/button";
import { useCreateChannelMutation } from "@/hooks/mutation/channels/useCreateChannelMutation";
import { useDeleteChannelMutation } from "@/hooks/mutation/channels/useDeleteChannelMutation";
import { useUpdateChannelMutation } from "@/hooks/mutation/channels/useUpdateChannelMutation";
import { useChannelsQuery } from "@/hooks/queries/channels/useChannelsQuery";
import { useWorkspacesQuery } from "@/hooks/queries/workspaces/useWorkspacesQuery";
import type { Channel } from "@/lib/types/channel.types";

const formatDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function WorkspaceChannelsPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params?.slug;
  const workspaceSlug =
    typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "");

  const {
    data: workspaces = [],
    isLoading: isWorkspacesLoading,
    error: workspaceQueryError,
  } = useWorkspacesQuery();
  const workspaceExists = workspaces.some((workspace) => workspace.slug === workspaceSlug);

  const {
    data: channels = [],
    isLoading,
    error: channelsQueryError,
  } = useChannelsQuery(workspaceExists ? workspaceSlug : "");
  const { mutate: createChannel, isPending: isCreating } = useCreateChannelMutation();
  const { mutate: updateChannel, isPending: isUpdating } = useUpdateChannelMutation();
  const { mutate: deleteChannel, isPending: isDeleting } = useDeleteChannelMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [channelNameInput, setChannelNameInput] = useState("");
  const [channelDescriptionInput, setChannelDescriptionInput] = useState("");
  const [createModalError, setCreateModalError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isMutating = isCreating || isUpdating || isDeleting;
  const queryErrorMessage =
    workspaceQueryError instanceof Error
      ? workspaceQueryError.message
      : channelsQueryError instanceof Error
        ? channelsQueryError.message
        : null;

  useEffect(() => {
    if (!workspaceSlug) {
      router.replace("/404");
      return;
    }

    if (isWorkspacesLoading || workspaceQueryError) {
      return;
    }

    if (!workspaceExists) {
      router.replace("/404");
    }
  }, [workspaceSlug, isWorkspacesLoading, workspaceQueryError, workspaceExists, router]);

  const handleOpenCreateModal = () => {
    setCreateModalError(null);
    setChannelNameInput("");
    setChannelDescriptionInput("");
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    if (isCreating) {
      return;
    }

    setIsCreateModalOpen(false);
  };

  const handleCreateChannel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = channelNameInput.trim();
    const trimmedDescription = channelDescriptionInput.trim();

    if (!trimmedName) {
      setCreateModalError("Channel name is required.");
      return;
    }

    setCreateModalError(null);
    setActionError(null);

    createChannel(
      {
        workspaceSlug,
        payload: {
          name: trimmedName,
          description: trimmedDescription || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
        },
        onError: (mutationError) => {
          setCreateModalError(mutationError.message);
        },
      },
    );
  };

  const handleRenameChannel = (channel: Channel) => {
    const nextName = window.prompt("Enter new channel name:", channel.name);

    if (!nextName || !nextName.trim() || nextName.trim() === channel.name) {
      return;
    }

    setActionError(null);
    updateChannel(
      {
        workspaceSlug,
        channelId: channel.id,
        payload: { name: nextName.trim() },
      },
      {
        onError: (mutationError) => {
          setActionError(mutationError.message);
        },
      },
    );
  };

  const handleDeleteChannel = (channel: Channel) => {
    const confirmed = window.confirm(`Delete channel "${channel.name}"?`);

    if (!confirmed) {
      return;
    }

    setActionError(null);
    deleteChannel(
      {
        workspaceSlug,
        channelId: channel.id,
      },
      {
        onError: (mutationError) => {
          setActionError(mutationError.message);
        },
      },
    );
  };

  if (!workspaceSlug) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Workspace slug is missing.</p>
      </div>
    );
  }

  if (isWorkspacesLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading workspace...</p>
      </div>
    );
  }

  if (!workspaceExists && !workspaceQueryError) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EBF1FB] p-6 transition-colors dark:bg-slate-950 md:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              #{workspaceSlug} channels
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create and manage channels for this workspace.
            </p>
          </div>

          <Button
            type="button"
            variant="default"
            disabled={isCreating}
            onClick={handleOpenCreateModal}
            className="h-10 px-4"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {isCreating ? "Creating..." : "New Channel"}
          </Button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Channels</h2>

          {queryErrorMessage && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {queryErrorMessage}
            </p>
          )}

          {actionError && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {actionError}
            </p>
          )}

          {isLoading && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading channels...</p>
          )}

          {!isLoading && channels.length === 0 && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No channels found for this workspace.
            </p>
          )}

          <div className="mt-4 space-y-3">
            {channels.map((channel) => {
              const createdAtLabel = formatDate(channel.createdAt);

              return (
                <article
                  key={channel.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="inline-flex items-center gap-1.5 text-base font-semibold text-slate-800 dark:text-slate-100">
                        <Hash className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        {channel.name}
                      </p>
                      {channel.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {channel.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => handleRenameChannel(channel)}
                      >
                        Rename
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => handleDeleteChannel(channel)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {createdAtLabel && (
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      Created {createdAtLabel}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                Create Channel
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add a channel for this workspace.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleCreateChannel}>
              <div>
                <label
                  htmlFor="workspace-channel-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Channel name
                </label>
                <input
                  id="workspace-channel-name"
                  type="text"
                  value={channelNameInput}
                  onChange={(event) => setChannelNameInput(event.target.value)}
                  placeholder="e.g. engineering"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="workspace-channel-description"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Description
                </label>
                <input
                  id="workspace-channel-description"
                  type="text"
                  value={channelDescriptionInput}
                  onChange={(event) => setChannelDescriptionInput(event.target.value)}
                  placeholder="Optional"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {createModalError && <p className="text-sm text-red-600">{createModalError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCreateModal}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Channel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
