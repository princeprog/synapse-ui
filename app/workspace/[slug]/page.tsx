import type { Metadata } from "next";

import WorkspaceChannelsPage from "@/components/workspace/[slug]/WorkspaceChannelsPage";

type WorkspaceSlugPageParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: WorkspaceSlugPageParams | Promise<WorkspaceSlugPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Workspace | ${decodeURIComponent(slug)}`,
  };
}

export default function WorkspacePage() {
  return <WorkspaceChannelsPage />;
}