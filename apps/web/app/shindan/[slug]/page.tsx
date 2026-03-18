import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getShindanConfigBySlug } from '@affiliate/shared';
import DiagnosticEngine from './DiagnosticEngine';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getShindanConfigBySlug(slug);
  if (!config) return {};
  return { title: config.title, description: config.description };
}

export default async function ShindanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getShindanConfigBySlug(slug);
  if (!config) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          {config.title}
        </h1>
        <p className="text-gray-600 text-lg">{config.description}</p>
      </div>
      <DiagnosticEngine config={config} />
    </main>
  );
}
