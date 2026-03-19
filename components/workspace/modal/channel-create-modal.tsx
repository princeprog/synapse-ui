"use client"

import type { FormEvent } from "react"
import { Button } from "@/components/common/button"

type ChannelCreateModalProps = {
  isOpen: boolean
  isCreating: boolean
  channelName: string
  channelDescription: string
  errorMessage: string | null
  onChannelNameChange: (value: string) => void
  onChannelDescriptionChange: (value: string) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ChannelCreateModal({
  isOpen,
  isCreating,
  channelName,
  channelDescription,
  errorMessage,
  onChannelNameChange,
  onChannelDescriptionChange,
  onClose,
  onSubmit,
}: ChannelCreateModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Create Channel
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add a new channel for this workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="sidebar-channel-name"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Channel name
            </label>
            <input
              id="sidebar-channel-name"
              type="text"
              value={channelName}
              onChange={(event) => onChannelNameChange(event.target.value)}
              placeholder="e.g. engineering"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="sidebar-channel-description"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Description
            </label>
            <input
              id="sidebar-channel-description"
              type="text"
              value={channelDescription}
              onChange={(event) => onChannelDescriptionChange(event.target.value)}
              placeholder="Optional"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Channel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
