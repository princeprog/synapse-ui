import WorkspaceProfileSettings from "@/components/workspace/profile/WorkspaceProfileSettings";

type WorkspaceSlugProfilePageParams = {
  slug: string;
};

export default async function WorkspaceScopedProfilePage({
  params,
}: {
  params: WorkspaceSlugProfilePageParams | Promise<WorkspaceSlugProfilePageParams>;
}) {
  const resolvedParams = await params;

  return <WorkspaceProfileSettings workspaceSlug={resolvedParams.slug} />;
}
