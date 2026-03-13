import type { DiagnosticConfig } from '../types';

export const shindanConfigs: DiagnosticConfig[] = [
  {
    slug: 'fukugyo',
    title: 'あなたに合った副業診断',
    description: '4つの質問でピッタリの副業スタイルを無料診断します',
    startQuestion: 'q1',
    questions: [
      {
        id: 'q1',
        text: '副業に使える時間はどのくらいですか？',
        options: [
          { label: '週5時間以下（スキマ時間のみ）', value: 'low', next: 'q2' },
          { label: '週10〜20時間', value: 'mid', next: 'q2' },
          { label: '週20時間以上', value: 'high', next: 'q2' },
        ],
      },
      {
        id: 'q2',
        text: '得意なことやスキルはありますか？',
        options: [
          { label: '文章を書くこと', value: 'writing', next: 'q3' },
          { label: 'デザインや動画編集', value: 'creative', next: 'result:creative' },
          { label: '特にない・わからない', value: 'none', next: 'q3' },
        ],
      },
      {
        id: 'q3',
        text: 'PCはどの程度使えますか？',
        options: [
          { label: 'ブログやSNSの操作は得意', value: 'web', next: 'result:blogger' },
          { label: 'ワード・エクセル程度は使える', value: 'basic', next: 'result:beginner' },
          { label: 'あまり自信がない', value: 'poor', next: 'result:easy' },
        ],
      },
    ],
    results: {
      creative: {
        title: 'クリエイター系副業',
        description:
          'デザインや動画スキルを活かしたSNSマーケティングやフリーランス案件に最適です。クライアントワークで安定収入を目指しましょう。',
        offer_id: 'sample-offer-1',
        cta: '詳しく見る →',
      },
      blogger: {
        title: 'ブログ・アフィリエイト',
        description:
          'ライティングスキルとWeb知識を活かしたブログアフィリエイトが最適です。資産型収入を構築できます。',
        offer_id: 'sample-offer-1',
        cta: '無料で始める →',
      },
      beginner: {
        title: '初心者向けアフィリエイト',
        description:
          'テンプレートを使ったシンプルなアフィリエイトから始めましょう。基礎を学びながら収益化を目指せます。',
        offer_id: 'sample-offer-1',
        cta: '今すぐチェック →',
      },
      easy: {
        title: 'スマホ副業',
        description:
          'PCが苦手でもスマートフォン1台で始められる副業がおすすめです。操作が簡単で今日から始められます。',
        offer_id: 'sample-offer-1',
        cta: '無料で確認する →',
      },
    },
  },
];
