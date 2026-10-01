import { redirect } from 'next/navigation';

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  redirect(`/umrah/${resolvedParams.slug}`);
}
