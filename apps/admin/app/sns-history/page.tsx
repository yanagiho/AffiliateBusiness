import { query } from '@/lib/db';
import LogoutButton from '../../components/LogoutButton';

export const dynamic = 'force-dynamic';

interface SNSPost {
  id: number;
  lp_slug: string;
  platform: string;
  post_id: string | null;
  content: string;
  success: number;
  error_msg: string | null;
  created_at: string;
}

export default async function SNSHistoryPage() {
  const posts = await query.all('SELECT * FROM sns_posts ORDER BY created_at DESC') as SNSPost[];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SNS投稿履歴</h1>
        <LogoutButton />
      </div>

      {/* タブ */}
      <div className="mb-6">
        <nav className="flex flex-wrap gap-2" aria-label="Tabs">
          <a href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            クリックログ
          </a>
          <a href="/generate-lp" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            LP生成
          </a>
          <a href="/offers" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            オファー管理
          </a>
          <a href="/sns-history" className="bg-indigo-100 text-indigo-700 px-3 py-2 font-medium text-sm rounded-md">
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">投稿履歴</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プラットフォーム
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  投稿ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  エラー
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(post.created_at).toLocaleString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a
                      href={`${process.env.WEB_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}/lp/${post.lp_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 underline"
                    >
                      {post.lp_slug}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {post.success ? '成功' : '失敗'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.post_id || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {post.error_msg || '-'}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    まだSNS投稿履歴がありません
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