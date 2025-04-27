import { PostDetail } from "./post-detail";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <PostDetail id={resolvedParams.id} />;
}
