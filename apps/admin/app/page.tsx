import { query } from '@/lib/db';
import type { ClickLog, Offer, LPConfig, DiagnosticConfig } from '@affiliate/shared';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const logs = await query.all('SELECT * FROM click_logs ORDER BY clicked_at DESC LIMIT 100') as ClickLog[];

  const total = await query.get('SELECT COUNT(*) as cnt FROM click_logs', []) as { cnt: number };

  const byOffer = await query.all(
    'SELECT offer_id, COUNT(*) as cnt FROM click_logs GROUP BY offer_id ORDER BY cnt DESC'
  ) as { offer_id: string; cnt: number }[];

  const offers = await query.all('SELECT * FROM offers ORDER BY created_at DESC') as Offer[];

  const lpConfigs = await query.all('SELECT slug, title, description, created_at FROM lp_configs ORDER BY created_at DESC') as (Pick<LPConfig, 'slug' | 'title' | 'description'> & { created_at: string })[];

  const shindanConfigs = await query.all('SELECT slug, title, description, created_at FROM shindan_configs ORDER BY created_at DESC') as (Pick<DiagnosticConfig, 'slug' | 'title' | 'description'> & { created_at: string })[];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">管理ダッシュボード</h1>

      {/* タブ */}
      <div className="mb-6">
        <nav className="flex flex-wrap gap-2" aria-label="Tabs">
          <a href="/" className="bg-indigo-100 text-indigo-700 px-3 py-2 font-medium text-sm rounded-md">
            クリックログ
          </a>
          <a href="/generate-lp" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            LP生成
          </a>
          <a href="/offers" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            オファー管理
          </a>
          <a href="/sns-history" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            SNS履歴
          </a>
          <a href="/genres" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            ジャンル管理
          </a>
          <a href="/sns-accounts" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            SNSアカウント
          </a>
        </nav>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">総クリック数</p>
          <p className="text-3xl font-bold text-indigo-600">{total.cnt}</p>
        </div>
        {byOffer.slice(0, 3).map((row) => (
          <div key={row.offer_id} className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1 truncate">{row.offer_id}</p>
            <p className="text-3xl font-bold text-gray-800">{row.cnt}</p>
          </div>
        ))}
      </div>

      {/* オファー別集計 */}
      {byOffer.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <h2 className="font-semibold text-gray-700 mb-3">オファー別クリック数</h2>
          <div className="space-y-2">
            {byOffer.map((row) => (
              <div key={row.offer_id} className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-600 w-48 truncate">
                  {row.offer_id}
                </span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{
                      width: `${Math.round((row.cnt / total.cnt) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">
                  {row.cnt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* オファー管理 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <h2 className="font-semibold text-gray-700 mb-3">オファー管理</h2>
        <div className="space-y-2">
          {offers.map((offer) => (
            <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{offer.name}</p>
                <p className="text-sm text-gray-600">{offer.url}</p>
                <p className="text-xs text-gray-500">{offer.id}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                編集
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LP管理 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <h2 className="font-semibold text-gray-700 mb-3">LP管理</h2>
        <div className="space-y-2">
          {lpConfigs.map((lp) => (
            <div key={lp.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{lp.title}</p>
                <p className="text-sm text-gray-600">{lp.description}</p>
                <p className="text-xs text-gray-500">/{lp.slug}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                編集
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 診断管理 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <h2 className="font-semibold text-gray-700 mb-3">診断管理</h2>
        <div className="space-y-2">
          {shindanConfigs.map((shindan) => (
            <div key={shindan.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{shindan.title}</p>
                <p className="text-sm text-gray-600">{shindan.description}</p>
                <p className="text-xs text-gray-500">/{shindan.slug}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                編集
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* クリックログ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-700">クリックログ（最新100件）</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">オファー</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">UTM Source</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">UTM Medium</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">UTM Campaign</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Referer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{log.id}</td>
                  <td className="px-4 py-3 text-indigo-600 font-mono text-xs">{log.offer_id}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">{new Date(log.clicked_at).toLocaleString('ja-JP')}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{log.utm_source ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{log.utm_medium ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{log.utm_campaign ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.ip ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {log.referer ?? '-'}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    まだクリックログがありません。
                    <br />
                    <span className="text-sm">
                      apps/web の /go/[offer_id] を叩くとここに表示されます。
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
