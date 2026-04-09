'use client';

import { useState, useEffect } from 'react';
import { LPGenerationRequest, LPContent, Offer, SNSPostResult } from '@affiliate/shared';
import LogoutButton from '../../components/LogoutButton';

export default function GenerateLPPage() {
  const [formData, setFormData] = useState<LPGenerationRequest & { genre?: string; snsAccountIds?: string[] }>({
    title: '',
    description: '',
    targetAudience: '',
    offerId: '',
    keywords: [],
    genre: '',
    snsAccountIds: [],
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<LPContent | null>(null);
  const [generatedSlug, setGeneratedSlug] = useState<string>('');
  const [generatedLpUrl, setGeneratedLpUrl] = useState<string>('');
  const [snsResults, setSnsResults] = useState<SNSPostResult[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
  const [snsAccounts, setSnsAccounts] = useState<{id: number, platform: string, account_name: string}[]>([]);

  // Load offers, genres, and SNS accounts on mount
  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => setOffers(data));

    // Load genres (mock data for now)
    setGenres([
      { id: 1, name: '健康・美容' },
      { id: 2, name: '教育・学習' },
      { id: 3, name: 'ビジネス' },
      { id: 4, name: 'ライフスタイル' },
    ]);

    fetch('/api/sns-accounts')
      .then(res => res.json())
      .then(data => setSnsAccounts(data));
  }, []);

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-lp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate LP');
      }

      const result = await response.json();
      setGeneratedContent(result.content);
      setGeneratedSlug(result.slug);
      // Derive web URL from current admin URL
      const currentOrigin = window.location.origin;
      let webUrl: string;
      if (currentOrigin.includes('affiliate-admin')) {
        webUrl = `${currentOrigin.replace('affiliate-admin', 'affiliate-web')}/lp/${result.slug}`;
      } else if (currentOrigin.includes('localhost:3001')) {
        webUrl = `http://localhost:3000/lp/${result.slug}`;
      } else {
        webUrl = result.lpUrl || `/lp/${result.slug}`;
      }
      setGeneratedLpUrl(webUrl);
      setSnsResults(result.snsResults || []);
    } catch (error) {
      console.error('Error generating LP:', error);
      alert('LP生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">LP自動生成</h1>
        <LogoutButton />
      </div>

      {/* タブ */}
      <div className="mb-6">
        <nav className="flex flex-wrap gap-2" aria-label="Tabs">
          <a href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
            クリックログ
          </a>
          <a href="/generate-lp" className="bg-indigo-100 text-indigo-700 px-3 py-2 font-medium text-sm rounded-md">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* フォーム */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">LP情報入力</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LPタイトル
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ターゲットオーディエンス
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: 20代のビジネスパーソン"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                関連オファー
              </label>
              <select
                value={formData.offerId}
                onChange={(e) => setFormData(prev => ({ ...prev, offerId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">選択してください</option>
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ジャンル
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">選択してください</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SNS投稿アカウント
              </label>
              <div className="space-y-2">
                {snsAccounts.map((account) => (
                  <label key={account.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.snsAccountIds?.includes(account.id.toString()) || false}
                      onChange={(e) => {
                        const accountId = account.id.toString();
                        setFormData(prev => ({
                          ...prev,
                          snsAccountIds: e.target.checked
                            ? [...(prev.snsAccountIds || []), accountId]
                            : (prev.snsAccountIds || []).filter(id => id !== accountId)
                        }));
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {account.platform} - {account.account_name}
                    </span>
                  </label>
                ))}
                {snsAccounts.length === 0 && (
                  <p className="text-sm text-gray-500">SNSアカウントが登録されていません</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                キーワード
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="キーワードを入力"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  追加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : 'LPを生成'}
            </button>
          </form>
        </div>

        {/* 生成結果 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">生成結果</h2>
          {generatedSlug && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">LPが正常に生成されました！</p>
              <p className="text-green-700 text-sm mt-1">
                LP URL: <a href={generatedLpUrl || `/lp/${generatedSlug}`} target="_blank" rel="noopener noreferrer" className="underline">
                  {generatedLpUrl || `/lp/${generatedSlug}`}
                </a>
              </p>
              {snsResults.length > 0 && (
                <div className="mt-3">
                  <p className="text-green-800 font-medium text-sm">SNS投稿結果:</p>
                  {snsResults.map((result, index) => (
                    <div key={index} className={`text-xs mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      {result.platform}: {result.success ? '成功' : `失敗 - ${result.error}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {generatedContent ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{generatedContent.title}</h3>
                <p className="text-lg font-semibold text-indigo-600 mt-1">
                  {generatedContent.headline}
                </p>
                <p className="text-gray-600 mt-1">{generatedContent.subheadline}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">セクション</h4>
                {generatedContent.sections.map((section, index) => (
                  <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
                    <h5 className="font-medium">{section.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{section.content}</p>
                    {section.cta && (
                      <p className="text-sm font-medium text-indigo-600 mt-1">
                        CTA: {section.cta}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">{generatedContent.footer}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">LPが生成されるとここに表示されます</p>
          )}
        </div>
      </div>
    </div>
  );
}