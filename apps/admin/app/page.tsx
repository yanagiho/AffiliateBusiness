import db from '@/lib/db';
import type { ClickLog } from '@affiliate/shared';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const logs = db
    .prepare('SELECT * FROM click_logs ORDER BY clicked_at DESC LIMIT 100')
    .all() as ClickLog[];

  const total = db
    .prepare('SELECT COUNT(*) as cnt FROM click_logs')
    .get() as { cnt: number };

  const byOffer = db
    .prepare(
      'SELECT offer_id, COUNT(*) as cnt FROM click_logs GROUP BY offer_id ORDER BY cnt DESC'
    )
    .all() as { offer_id: string; cnt: number }[];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">クリックログ</h1>

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

      {/* ログテーブル */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                'ID',
                'Offer',
                'クリック日時',
                'UTM Source',
                'UTM Campaign',
                'UTM Medium',
                'IP',
                'Referer',
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{log.id}</td>
                <td className="px-4 py-3 font-medium text-indigo-600 whitespace-nowrap">
                  {log.offer_id}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{log.clicked_at}</td>
                <td className="px-4 py-3 text-gray-600">{log.utm_source ?? '-'}</td>
                <td className="px-4 py-3 text-gray-600">{log.utm_campaign ?? '-'}</td>
                <td className="px-4 py-3 text-gray-600">{log.utm_medium ?? '-'}</td>
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
  );
}
