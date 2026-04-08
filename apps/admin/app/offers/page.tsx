'use client';

import { useState, useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';

interface Offer {
  id: string;
  name: string;
  url: string;
  description?: string;
  created_at?: string;
}

const NAV_TABS = [
  { href: '/', label: 'クリックログ' },
  { href: '/generate-lp', label: 'LP生成' },
  { href: '/offers', label: 'オファー管理' },
  { href: '/sns-history', label: 'SNS履歴' },
  { href: '/genres', label: 'ジャンル管理' },
  { href: '/sns-accounts', label: 'SNSアカウント' },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState({ id: '', name: '', url: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadOffers = () => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => setOffers(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || '登録に失敗しました' });
      } else {
        setMessage({ type: 'success', text: `オファー「${form.name}」を登録しました` });
        setForm({ id: '', name: '', url: '', description: '' });
        loadOffers();
      }
    } catch {
      setMessage({ type: 'error', text: 'ネットワークエラーが発生しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    const res = await fetch(`/api/offers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) {
      loadOffers();
    } else {
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">オファー管理</h1>
        <LogoutButton />
      </div>

      <nav className="flex flex-wrap gap-2 mb-6">
        {NAV_TABS.map(tab => (
          <a
            key={tab.href}
            href={tab.href}
            className={`px-3 py-2 font-medium text-sm rounded-md ${
              tab.href === '/offers'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 登録フォーム */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">新規オファー登録</h2>

          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                オファーID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.id}
                onChange={e => setForm(prev => ({ ...prev, id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: chibabank-card-loan"
                required
              />
              <p className="text-xs text-gray-500 mt-1">半角英数字・ハイフン推奨。/go/[ID] のURLに使われます</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                オファー名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: 千葉銀行カードローン"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                アフィリエイトURL <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.url}
                onChange={e => setForm(prev => ({ ...prev, url: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明（任意）
              </label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: A8.net経由 家計改善テーマ"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? '登録中...' : 'オファーを登録'}
            </button>
          </form>
        </div>

        {/* 一覧 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">登録済みオファー ({offers.length}件)</h2>
          {offers.length === 0 ? (
            <p className="text-gray-500 text-sm">まだオファーが登録されていません</p>
          ) : (
            <div className="space-y-3">
              {offers.map(offer => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">{offer.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {offer.id}</p>
                      {offer.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{offer.description}</p>
                      )}
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline mt-1 block truncate"
                      >
                        {offer.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(offer.id, offer.name)}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs shrink-0"
                    >
                      削除
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-400">
                      /go/{offer.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
