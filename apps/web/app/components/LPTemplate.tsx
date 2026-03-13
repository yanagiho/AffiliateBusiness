import type { LPConfig } from '@affiliate/shared';

export function LPTemplate({ config }: { config: LPConfig }) {
  const ctaUrl = (position: string) =>
    `/go/${config.hero.offer_id}?utm_source=lp&utm_medium=${position}&utm_campaign=${config.slug}`;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 whitespace-pre-line">
            {config.hero.headline}
          </h1>
          <p className="text-xl text-indigo-200 mb-10">{config.hero.subheadline}</p>
          <a
            href={ctaUrl('hero')}
            className="inline-block bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-4 px-10 rounded-2xl text-xl transition-colors shadow-lg"
          >
            {config.hero.cta}
          </a>
        </div>
      </section>

      {/* Features */}
      {config.features && config.features.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              選ばれる3つの理由
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {config.features.map((f, i) => (
                <div key={i} className="text-center p-6 bg-gray-50 rounded-2xl">
                  <div className="text-5xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {config.faq && config.faq.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
              よくある質問
            </h2>
            <div className="space-y-4">
              {config.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">Q. {item.question}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">A. {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">まずは無料で確認する</h2>
          <p className="text-indigo-200 mb-8">登録・費用は一切かかりません</p>
          <a
            href={ctaUrl('bottom')}
            className="inline-block bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-4 px-10 rounded-2xl text-xl transition-colors"
          >
            {config.hero.cta}
          </a>
        </div>
      </section>
    </div>
  );
}
