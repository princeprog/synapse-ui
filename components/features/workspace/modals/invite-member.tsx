"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInviteMemberMutation } from "@/hooks/mutation/workspaces/use-invite-member"
import { useParams } from "next/navigation"
import { FormEvent, useMemo, useState } from "react"
import { SelectRole } from "../select-role"

type InviteModalProps = {
    trigger: React.ReactNode
    onSubmitInvite?: (event: FormEvent<HTMLFormElement>) => void
}

export function InviteModal({ trigger, onSubmitInvite }: InviteModalProps) {
    const params = useParams()
    const slugParam = params?.slug
    const workspaceSlug = useMemo(
        () => (typeof slugParam === "string" ? slugParam : (slugParam?.[0] ?? "")),
        [slugParam],
    )

    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<"Admin" | "Member">("Member")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { mutate: inviteMember, isPending: isInviting } = useInviteMemberMutation()

    const resetForm = () => {
        setEmail("")
        setRole("Member")
        setErrorMessage(null)
    }

    const handleOpenChange = (nextOpen: boolean) => {
        setIsOpen(nextOpen)

        if (!nextOpen) {
            resetForm()
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (onSubmitInvite) {
            onSubmitInvite(event)
            return
        }

        if (!workspaceSlug || isInviting) {
            return
        }

        const trimmedEmail = email.trim()
        if (!trimmedEmail) {
            setErrorMessage("Email is required.")
            return
        }

        setErrorMessage(null)
        inviteMember(
            {
                workspaceSlug,
                data: {
                    email: trimmedEmail,
                    role,
                },
            },
            {
                onSuccess: () => {
                    setIsOpen(false)
                    resetForm()
                },
                onError: (error) => {
                    setErrorMessage(error.message)
                },
            },
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Invite Member</DialogTitle>
                        <DialogDescription>
                            Invite a new member to your workspace. Enter their email address below.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="email-1">Email</Label>
                            <Input
                                id="email-1"
                                name="email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={isInviting}
                                required
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="role-1">Role</Label>
                            <SelectRole value={role} onValueChange={setRole} disabled={isInviting} />
                        </Field>
                    </FieldGroup>

                    {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={isInviting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isInviting || !workspaceSlug}>
                            {isInviting ? "Inviting..." : "Invite"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
