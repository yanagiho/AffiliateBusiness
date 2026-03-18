import { query } from '@/lib/db';
import LogoutButton from '../../components/LogoutButton';

export const dynamic = 'force-dynamic';

interface SNSAccount {
  id: number;
  platform: string;
  account_name: string;
  is_active: number;
  created_at: string;
}

export default async function SNSAccountsPage() {
  const accounts = await query.all('SELECT id, platform, account_name, is_active, created_at FROM sns_accounts ORDER BY created_at DESC') as SNSAccount[];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SNSアカウント管理</h1>
        <LogoutButton />
      </div>

      {/* タブ */}
      <div className="mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          <a href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            クリックログ
          </a>
          <a href="/generate-lp" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            LP生成
          </a>
          <a href="/sns-history" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            SNS履歴
          </a>
          <a href="/genres" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            ジャンル管理
          </a>
          <a href="/sns-accounts" className="bg-indigo-100 text-indigo-700 px-3 py-2 font-medium text-sm rounded-md">
            SNSアカウント
          </a>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">SNSアカウント一覧</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
            新規アカウント追加
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プラットフォーム
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アカウント名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.platform === 'twitter'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {account.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.account_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.is_active ? '有効' : '無効'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      編集
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      削除
                    </button>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    まだSNSアカウントが登録されていません
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