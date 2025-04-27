import { PostEditForm } from "./post-edit-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <PostEditForm id={resolvedParams.id} />;
}
