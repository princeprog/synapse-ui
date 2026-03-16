import type { Metadata } from "next";
import WorkspaceDashboard from "@/components/workspace/WorkspaceDashboard";

export const metadata: Metadata = {
  title: "Workspace | Synapse",
  description: "Select a workspace to continue",
};

export default function WorkspacePage() {
  return <WorkspaceDashboard />;
}