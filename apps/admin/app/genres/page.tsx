import db, { query } from '@/lib/db';
import LogoutButton from '../components/LogoutButton';

export const dynamic = 'force-dynamic';

interface Genre {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default async function GenresPage() {
  // ジャンル一覧を取得（仮定で固定データを使用）
  const genres: Genre[] = [
    { id: 1, name: '健康・美容', description: '健康食品、サプリメント、美容関連', created_at: '2024-01-01' },
    { id: 2, name: '教育・学習', description: 'オンライン講座、教材、資格取得', created_at: '2024-01-01' },
    { id: 3, name: 'ビジネス', description: '起業支援、ビジネスツール、コンサル', created_at: '2024-01-01' },
    { id: 4, name: 'ライフスタイル', description: 'ファッション、インテリア、生活雑貨', created_at: '2024-01-01' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ジャンル管理</h1>
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
          <a href="/genres" className="bg-indigo-100 text-indigo-700 px-3 py-2 font-medium text-sm rounded-md">
            ジャンル管理
          </a>
          <a href="/sns-accounts" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            SNSアカウント
          </a>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">ジャンル一覧</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
            新規ジャンル追加
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ジャンル名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  説明
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
              {genres.map((genre) => (
                <tr key={genre.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {genre.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {genre.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(genre.created_at).toLocaleDateString('ja-JP')}
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
              {genres.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    まだジャンルが登録されていません
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