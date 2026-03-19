'use client';

import { useState, useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';

interface SNSAccount {
  id: number;
  platform: string;
  account_name: string;
  theme: string;
  character_name: string;
  character_role: string;
  character_bio: string;
  character_tone: string;
  post_format: string;
  cta_style: string;
  forbidden_expressions: string;
  visual_direction: string;
  is_active: number;
}

const TABS = [
  { href: '/', label: 'クリックログ' },
  { href: '/generate-lp', label: 'LP生成' },
  { href: '/sns-history', label: 'SNS履歴' },
  { href: '/genres', label: 'ジャンル管理' },
  { href: '/sns-accounts', label: 'SNSアカウント' },
];

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'X (Twitter)',
  instagram: 'Instagram',
};

const THEME_COLORS: Record<string, string> = {
  転職: 'bg-blue-100 text-blue-800',
  投資: 'bg-green-100 text-green-800',
  家計改善: 'bg-yellow-100 text-yellow-800',
  恋愛: 'bg-pink-100 text-pink-800',
  野球: 'bg-orange-100 text-orange-800',
};

export default function SNSAccountsPage() {
  const [accounts, setAccounts] = useState<SNSAccount[]>([]);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<SNSAccount | null>(null);
  const [apiKeys, setApiKeys] = useState({ api_key: '', api_secret: '', access_token: '', access_secret: '' });
  const [savingKeys, setSavingKeys] = useState(false);
  const [tab, setTab] = useState<'list' | 'import'>('list');

  const fetchAccounts = async () => {
    const res = await fetch('/api/sns-accounts');
    const data = await res.json();
    setAccounts(data);
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleImport = async () => {
    setImporting(true);
    setImportResult(null);
    try {
      const parsed = JSON.parse(importJson);
      const res = await fetch('/api/sns-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const result = await res.json();
      if (result.success) {
        setImportResult(`✅ ${result.inserted}件のアカウントを登録しました`);
        setImportJson('');
        setTab('list');
        fetchAccounts();
      } else {
        setImportResult(`❌ エラー: ${result.error}`);
      }
    } catch {
      setImportResult('❌ JSONの形式が正しくありません。確認してください。');
    } finally {
      setImporting(false);
    }
  };

  const handleSaveKeys = async () => {
    if (!selectedAccount) return;
    setSavingKeys(true);
    try {
      await fetch('/api/sns-accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedAccount.id, ...apiKeys, is_active: true }),
      });
      setSelectedAccount(null);
      setApiKeys({ api_key: '', api_secret: '', access_token: '', access_secret: '' });
      fetchAccounts();
    } finally {
      setSavingKeys(false);
    }
  };

  const grouped = accounts.reduce<Record<string, SNSAccount[]>>((acc, a) => {
    const key = a.theme || 'その他';
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SNSアカウント管理</h1>
        <LogoutButton />
      </div>

      {/* タブ */}
      <nav className="flex space-x-4 mb-6">
        {TABS.map(t => (
          <a key={t.href} href={t.href}
            className={`px-3 py-2 font-medium text-sm rounded-md ${t.href === '/sns-accounts' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </a>
        ))}
      </nav>

      {/* サブタブ */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('list')}
          className={`pb-2 px-4 text-sm font-medium border-b-2 ${tab === 'list' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
          アカウント一覧
        </button>
        <button
          onClick={() => setTab('import')}
          className={`pb-2 px-4 text-sm font-medium border-b-2 ${tab === 'import' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
          JSONインポート
        </button>
      </div>

      {/* JSONインポートタブ */}
      {tab === 'import' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">ChatGPTのJSONをインポート</h2>
          <p className="text-sm text-gray-500 mb-4">
            ChatGPTで生成したアカウント設計JSONをそのまま貼り付けてください。
          </p>
          <textarea
            value={importJson}
            onChange={e => setImportJson(e.target.value)}
            rows={16}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={'{\n  "accounts": [\n    { "platform": "twitter", "theme": "転職", ... }\n  ]\n}'}
          />
          {importResult && (
            <p className={`mt-3 text-sm font-medium ${importResult.startsWith('✅') ? 'text-green-700' : 'text-red-600'}`}>
              {importResult}
            </p>
          )}
          <button
            onClick={handleImport}
            disabled={importing || !importJson.trim()}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {importing ? 'インポート中...' : '一括インポート'}
          </button>
        </div>
      )}

      {/* アカウント一覧タブ */}
      {tab === 'list' && (
        <>
          {accounts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
              <p className="mb-2">アカウントがまだ登録されていません。</p>
              <button onClick={() => setTab('import')} className="text-indigo-600 hover:underline text-sm">
                JSONインポートで登録する →
              </button>
            </div>
          ) : (
            Object.entries(grouped).map(([theme, accs]) => (
              <div key={theme} className="mb-8">
                <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${THEME_COLORS[theme] || 'bg-gray-100 text-gray-700'}`}>
                    {theme}
                  </span>
                  <span>テーマ — {accs.length}アカウント</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accs.map(account => (
                    <div key={account.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full mr-2 ${account.platform === 'twitter' ? 'bg-sky-100 text-sky-800' : 'bg-fuchsia-100 text-fuchsia-800'}`}>
                            {PLATFORM_LABELS[account.platform] || account.platform}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${account.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {account.is_active ? '有効' : '無効'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedAccount(account);
                            setApiKeys({ api_key: '', api_secret: '', access_token: '', access_secret: '' });
                          }}
                          className="text-xs text-indigo-600 hover:underline">
                          APIキー設定
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{account.account_name}</p>
                      <p className="font-semibold text-gray-900 mb-1">{account.character_name}</p>
                      <p className="text-xs text-gray-500 mb-2">{account.character_role}</p>
                      <p className="text-xs text-gray-600 bg-gray-50 rounded p-2 mb-2">{account.character_bio}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="font-medium text-gray-700">口調：</span>{account.character_tone}</p>
                        <p><span className="font-medium text-gray-700">フォーマット：</span>{account.post_format}</p>
                        <p><span className="font-medium text-gray-700">CTA：</span>{account.cta_style}</p>
                        <p><span className="font-medium text-gray-700">禁止表現：</span>{account.forbidden_expressions}</p>
                        <p><span className="font-medium text-gray-700">ビジュアル：</span>{account.visual_direction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* APIキー設定モーダル */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-1">{selectedAccount.character_name}</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedAccount.account_name} のAPIキーを設定します</p>
            <div className="space-y-3">
              {[
                { key: 'api_key', label: 'API Key' },
                { key: 'api_secret', label: 'API Secret' },
                { key: 'access_token', label: 'Access Token' },
                { key: 'access_secret', label: 'Access Token Secret' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="password"
                    value={(apiKeys as any)[key]}
                    onChange={e => setApiKeys(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={`${label}を入力`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setSelectedAccount(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm hover:bg-gray-50">
                キャンセル
              </button>
              <button
                onClick={handleSaveKeys}
                disabled={savingKeys}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50">
                {savingKeys ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
