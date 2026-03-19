import { TwitterApi } from 'twitter-api-v2';
import { query } from './db';
import { SNSAccount } from './types';

export interface SNSPostData {
  title: string;
  description: string;
  url: string;
  hashtags: string[];
  targetAudience: string;
}

export interface SNSPostResult {
  success: boolean;
  platform: string;
  accountName?: string;
  postId?: string;
  postText?: string;
  error?: string;
}

function getTwitterClient(account: Pick<SNSAccount, 'api_key' | 'api_secret' | 'access_token' | 'access_secret'>): TwitterApi {
  return new TwitterApi({
    appKey: account.api_key || process.env.TWITTER_API_KEY!,
    appSecret: account.api_secret || process.env.TWITTER_API_SECRET!,
    accessToken: account.access_token || process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: account.access_secret || process.env.TWITTER_ACCESS_SECRET!,
  });
}

// キャラクターの口調でClaude APIを使って投稿文を生成する
async function generateCharacterPost(account: SNSAccount, data: SNSPostData): Promise<string> {
  try {
    const { generateText } = await import('./claude');
    const hashtags = data.hashtags.map(tag => `#${tag}`).join(' ');
    const isTwitter = account.platform === 'twitter';

    const prompt = `あなたは「${account.character_name}」というSNSアカウントの中の人です。

キャラクター設定：
- 役割：${account.character_role}
- 口調：${account.character_tone}
- 投稿フォーマット：${account.post_format}
- CTA表現：${account.cta_style}
- 禁止表現：${account.forbidden_expressions}

以下のLPに関する投稿文を作成してください。

LP情報：
- タイトル：${data.title}
- 内容：${data.description}
- URL：${data.url}
- ターゲット：${data.targetAudience}
- ハッシュタグ：${hashtags}

${isTwitter
  ? `Xの投稿文を作成してください。
- 280文字以内
- キャラクターの口調・フォーマットを守る
- CTAを含める（URL込み）
- 禁止表現は絶対に使わない
- 本文のみ出力（説明不要）`
  : `Instagramの投稿キャプションを作成してください。
- 保存したくなる価値ある内容
- キャラクターの口調・フォーマットを守る
- CTAを含める（URL込み）
- 禁止表現は絶対に使わない
- 2000文字以内
- 本文のみ出力（説明不要）`}`;

    const text = await generateText(prompt);
    return text.trim();
  } catch {
    // Claude APIが使えない場合はデフォルトフォーマット
    const hashtags = data.hashtags.map(tag => `#${tag}`).join(' ');
    return `${data.title}\n\n${data.description}\n\n${data.url}\n\n${hashtags}`;
  }
}

export async function postToTwitter(
  data: SNSPostData,
  account: SNSAccount
): Promise<SNSPostResult> {
  try {
    const postText = await generateCharacterPost(account, data);
    const truncated = postText.length > 280 ? postText.substring(0, 277) + '...' : postText;

    const tweet = await getTwitterClient(account).v2.tweet(truncated);

    return {
      success: true,
      platform: 'twitter',
      accountName: account.account_name,
      postId: tweet.data.id,
      postText: truncated,
    };
  } catch (error) {
    return {
      success: false,
      platform: 'twitter',
      accountName: account.account_name,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function postToMultipleSNS(
  data: SNSPostData,
  accounts: SNSAccount[],
  lpSlug?: string
): Promise<SNSPostResult[]> {
  const results: SNSPostResult[] = [];

  for (const account of accounts) {
    let result: SNSPostResult;

    switch (account.platform) {
      case 'twitter':
        result = await postToTwitter(data, account);
        break;
      default:
        result = {
          success: false,
          platform: account.platform,
          accountName: account.account_name,
          error: `${account.platform} は未対応です`,
        };
    }

    results.push(result);

    if (lpSlug) {
      await query.run(
        `INSERT INTO sns_posts (lp_slug, platform, post_id, content, success, error_msg)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          lpSlug,
          result.platform,
          result.postId || null,
          result.postText || JSON.stringify(data),
          result.success ? 1 : 0,
          result.error || null,
        ]
      );
    }
  }

  return results;
}
