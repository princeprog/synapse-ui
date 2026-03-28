"use client"

import { useMemo, useState, type FormEvent } from "react"
import { useParams } from "next/navigation"

import { useCreateChannelMutation } from "@/hooks/mutation/channels/useCreateChannelMutation"
import { useDeleteChannelMutation } from "@/hooks/mutation/channels/useDeleteChannelMutation"
import { useUpdateChannelMutation } from "@/hooks/mutation/channels/useUpdateChannelMutation"
import { useChannelsQuery } from "@/hooks/queries/channels/useChannelsQuery"

type ChannelActionTarget = {
  id: string
  name: string
}

type ChannelSidebarItem = ChannelActionTarget & {
  url: string
}

export function useWorkspaceSidebarChannels() {
  const params = useParams()
  const slugParam = params?.slug
  const workspaceSlug =
    typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")

  const { data: channels = [], isLoading, error } = useChannelsQuery(workspaceSlug)
  const { mutate: createChannel, isPending: isCreating } = useCreateChannelMutation()
  const { mutate: updateChannel, isPending: isUpdating } = useUpdateChannelMutation()
  const { mutate: deleteChannel, isPending: isDeleting } = useDeleteChannelMutation()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [channelNameInput, setChannelNameInput] = useState("")
  const [channelDescriptionInput, setChannelDescriptionInput] = useState("")
  const [createModalError, setCreateModalError] = useState<string | null>(null)
  const [channelActionError, setChannelActionError] = useState<string | null>(null)

  const queryErrorMessage = error instanceof Error ? error.message : null
  const isMutating = isCreating || isUpdating || isDeleting

  const channelItems = useMemo<ChannelSidebarItem[]>(() => {
    return channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      url: `/workspace/${workspaceSlug}/channel/${channel.id}`,
    }))
  }, [channels, workspaceSlug])

  const handleOpenCreateModal = () => {
    if (!workspaceSlug || isCreating) {
      return
    }

    setCreateModalError(null)
    setChannelNameInput("")
    setChannelDescriptionInput("")
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    if (isCreating) {
      return
    }

    setIsCreateModalOpen(false)
  }

  const handleCreateChannel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!workspaceSlug || isCreating) {
      return
    }

    const trimmedName = channelNameInput.trim()
    const trimmedDescription = channelDescriptionInput.trim()

    if (!trimmedName) {
      setCreateModalError("Channel name is required.")
      return
    }

    setCreateModalError(null)
    setChannelActionError(null)

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
          setIsCreateModalOpen(false)
        },
        onError: (mutationError) => {
          setCreateModalError(mutationError.message)
        },
      }
    )
  }

  const handleRenameChannel = (channel: ChannelActionTarget) => {
    if (!workspaceSlug) {
      return
    }

    const nextChannelName = window.prompt("Enter new channel name:", channel.name)

    if (!nextChannelName || !nextChannelName.trim() || nextChannelName.trim() === channel.name) {
      return
    }

    setChannelActionError(null)
    updateChannel(
      {
        workspaceSlug,
        channelId: channel.id,
        payload: {
          name: nextChannelName.trim(),
        },
      },
      {
        onError: (mutationError) => {
          setChannelActionError(mutationError.message)
        },
      }
    )
  }

  const handleDeleteChannel = (channel: ChannelActionTarget) => {
    if (!workspaceSlug) {
      return
    }

    const confirmed = window.confirm(`Delete channel "${channel.name}"?`)

    if (!confirmed) {
      return
    }

    setChannelActionError(null)
    deleteChannel(
      {
        workspaceSlug,
        channelId: channel.id,
      },
      {
        onError: (mutationError) => {
          setChannelActionError(mutationError.message)
        },
      }
    )
  }

  return {
    channelItems,
    isLoading,
    isCreating,
    isMutating,
    canCreate: Boolean(workspaceSlug),
    channelErrorMessage: channelActionError ?? queryErrorMessage,
    openCreateModal: handleOpenCreateModal,
    renameChannel: handleRenameChannel,
    deleteChannel: handleDeleteChannel,
    createModalState: {
      isOpen: isCreateModalOpen,
      isCreating,
      channelName: channelNameInput,
      channelDescription: channelDescriptionInput,
      errorMessage: createModalError,
      onChannelNameChange: setChannelNameInput,
      onChannelDescriptionChange: setChannelDescriptionInput,
      onClose: handleCloseCreateModal,
      onSubmit: handleCreateChannel,
    },
  }
}
