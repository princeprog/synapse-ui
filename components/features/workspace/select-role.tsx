import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type WorkspaceRole = "Admin" | "Member"

type SelectRoleProps = {
  value: WorkspaceRole
  onValueChange: (role: WorkspaceRole) => void
  disabled?: boolean
}

export function SelectRole({ value, onValueChange, disabled = false }: SelectRoleProps) {
  return (
    <Select value={value} onValueChange={(nextValue) => onValueChange(nextValue as WorkspaceRole)}>
      <SelectTrigger className="w-full" disabled={disabled}>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Member">Member</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
