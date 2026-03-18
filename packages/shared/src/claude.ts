import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface LPGenerationRequest {
  title: string;
  description: string;
  targetAudience: string;
  offerId: string;
  keywords: string[];
}

export interface LPContent {
  title: string;
  headline: string;
  subheadline: string;
  heroImageDescription: string;
  sections: {
    title: string;
    content: string;
    cta?: string;
  }[];
  footer: string;
}

export async function generateLPContent(request: LPGenerationRequest): Promise<LPContent> {
  const prompt = `
あなたはアフィリエイトLPの専門家です。以下の情報を基に、魅力的なLPコンテンツを生成してください。

オファー情報:
- タイトル: ${request.title}
- 説明: ${request.description}
- ターゲット: ${request.targetAudience}
- キーワード: ${request.keywords.join(', ')}

LPの構造:
1. タイトル（SEO最適化）
2. ヘッドライン（注目を引く）
3. サブヘッドライン（詳細説明）
4. ヒーロー画像の説明
5. セクション（3-5個）:
   - 各セクションにタイトル、内容、CTA（任意）
6. フッター（クロージング）

JSON形式で返してください。内容は日本語で、説得力があり、コンバージョン率の高いものにしてください。
`;

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  try {
    const parsed = JSON.parse(content.text) as LPContent;
    return parsed;
  } catch (error) {
    throw new Error('Failed to parse Claude response as JSON');
  }
}