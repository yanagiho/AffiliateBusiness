import type { LPConfig } from '@affiliate/shared';

export function LPTemplate({ config }: { config: LPConfig }) {
  const ctaUrl = (position: string) =>
    `/go/${config.hero?.offer_id || config.content?.offerId}?utm_source=lp&utm_medium=${position}&utm_campaign=${config.slug}`;

  // If Claude generated content exists, use it
  if (config.content) {
    const content = config.content;
    const sections = content.sections || [];

    return (
      <div className="font-sans">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-900 text-white py-24 px-4">
          {/* Decorative circles */}
          <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-white/5 rounded-full" />
          <div className="absolute bottom-[-120px] left-[-60px] w-[400px] h-[400px] bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-400/10 to-transparent rounded-full blur-3xl" />

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-block bg-amber-400/20 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-amber-400/30">
              {content.title}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 whitespace-pre-line drop-shadow-lg">
              {content.headline}
            </h1>
            <p className="text-lg sm:text-xl text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              {content.subheadline}
            </p>
            <a
              href={ctaUrl('hero')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-900 font-bold py-4 px-10 rounded-2xl text-xl transition-all shadow-lg shadow-amber-400/30 hover:shadow-xl hover:shadow-amber-400/40 hover:-translate-y-0.5"
            >
              今すぐ申し込む
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <p className="mt-4 text-indigo-300 text-sm">※ 無料・登録30秒</p>
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-white border-b py-6 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              完全無料
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              登録かんたん30秒
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              退会自由
            </div>
          </div>
        </section>

        {/* Content sections */}
        {sections.map((section: any, index: number) => {
          const isEven = index % 2 === 0;
          const sectionIcons = ['💡', '🎯', '✨', '🚀', '🏆'];
          const icon = sectionIcons[index % sectionIcons.length];

          return (
            <section
              key={index}
              className={`py-20 px-4 ${isEven ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-indigo-50/30'}`}
            >
              <div className="max-w-4xl mx-auto">
                {/* Section number badge */}
                <div className="flex justify-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                    isEven
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-200'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-200'
                  }`}>
                    <span>{icon}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">
                  {section.title}
                </h2>

                {/* Content as card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
                  {section.content.includes('\n') ? (
                    <ul className="space-y-4">
                      {section.content.split('\n').filter(Boolean).map((line: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-gray-700 leading-relaxed">{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-700 leading-relaxed text-center">
                      {section.content}
                    </p>
                  )}
                </div>

                {section.cta && (
                  <div className="text-center mt-10">
                    <a
                      href={ctaUrl(`section-${index}`)}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
                    >
                      {section.cta}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </a>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* Steps section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
              かんたん3ステップ
            </h2>
            <p className="text-gray-500 text-center mb-12">お申し込みはとってもシンプル</p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '01', title: '無料登録', desc: 'まずは30秒でかんたん登録', color: 'from-blue-500 to-blue-700' },
                { step: '02', title: '情報入力', desc: 'あなたに合ったプランを診断', color: 'from-indigo-500 to-indigo-700' },
                { step: '03', title: '利用開始', desc: 'すぐにサービスを利用可能', color: 'from-purple-500 to-purple-700' },
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  {i < 2 && (
                    <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 to-gray-100" />
                  )}
                  <div className={`relative inline-flex w-16 h-16 rounded-full bg-gradient-to-br ${item.color} items-center justify-center text-white font-bold text-lg shadow-lg mb-4`}>
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white py-20 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">今すぐ始めましょう</h2>
            <p className="text-gray-400 mb-10 text-lg leading-relaxed">{content.footer}</p>
            <a
              href={ctaUrl('footer')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-900 font-bold py-5 px-12 rounded-2xl text-xl transition-all shadow-lg shadow-amber-400/20 hover:shadow-xl hover:shadow-amber-400/30 hover:-translate-y-0.5"
            >
              無料で始める
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <p className="mt-4 text-gray-500 text-sm">※ 費用は一切かかりません</p>
          </div>
        </section>
      </div>
    );
  }

  // Original template for legacy configs
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-900 text-white py-24 px-4">
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-white/5 rounded-full" />
        <div className="absolute bottom-[-120px] left-[-60px] w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 whitespace-pre-line drop-shadow-lg">
            {config.hero.headline}
          </h1>
          <p className="text-lg sm:text-xl text-indigo-200 mb-10">{config.hero.subheadline}</p>
          <a
            href={ctaUrl('hero')}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-900 font-bold py-4 px-10 rounded-2xl text-xl transition-all shadow-lg shadow-amber-400/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            {config.hero.cta}
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </section>

      {/* Features */}
      {config.features && config.features.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              選ばれる3つの理由
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {config.features.map((f, i) => (
                <div key={i} className="text-center p-8 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
              よくある質問
            </h2>
            <div className="space-y-4">
              {config.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <p className="font-bold text-gray-900 mb-2">Q. {item.question}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">A. {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">まずは無料で確認する</h2>
          <p className="text-gray-400 mb-8">登録・費用は一切かかりません</p>
          <a
            href={ctaUrl('bottom')}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-900 font-bold py-5 px-12 rounded-2xl text-xl transition-all shadow-lg shadow-amber-400/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            {config.hero.cta}
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </section>
    </div>
  );
}
