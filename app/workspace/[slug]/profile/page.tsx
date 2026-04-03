import { redirect } from "next/navigation";

type WorkspaceSlugProfilePageParams = {
  slug: string;
};

export default async function WorkspaceScopedProfilePage({
  params,
}: {
  params: WorkspaceSlugProfilePageParams | Promise<WorkspaceSlugProfilePageParams>;
}) {
  await params;
  redirect("/workspace/profile");
}
