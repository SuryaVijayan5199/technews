import { redirect } from "next/navigation";

export default async function ReviewSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/gaming/${slug}`);
}
