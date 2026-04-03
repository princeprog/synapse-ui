import type { Metadata } from "next";

import GlobalProfileSettings from "@/components/workspace/profile/GlobalProfileSettings";

export const metadata: Metadata = {
  title: "Profile Settings | Synapse",
  description: "Manage your global profile settings.",
};

export default function WorkspaceProfileSettingsPage() {
  return <GlobalProfileSettings />;
}
