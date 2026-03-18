import { TwitterApi } from 'twitter-api-v2';
import { query } from './db';

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

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
  postId?: string;
  error?: string;
}

export async function postToTwitter(data: SNSPostData): Promise<SNSPostResult> {
  try {
    // Create engaging tweet content
    const hashtags = data.hashtags.map(tag => `#${tag}`).join(' ');
    const tweetText = `${data.title}

${data.description}

詳細はこちら👇
${data.url}

${hashtags}`;

    // Ensure tweet is within 280 characters
    const truncatedText = tweetText.length > 280 ? tweetText.substring(0, 277) + '...' : tweetText;

    const tweet = await twitterClient.v2.tweet(truncatedText);

    return {
      success: true,
      platform: 'twitter',
      postId: tweet.data.id,
    };
  } catch (error) {
    console.error('Twitter post error:', error);
    return {
      success: false,
      platform: 'twitter',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function postToMultipleSNS(data: SNSPostData, platforms: string[] = ['twitter'], lpSlug?: string): Promise<SNSPostResult[]> {
  const results: SNSPostResult[] = [];

  for (const platform of platforms) {
    let result: SNSPostResult;
    switch (platform) {
      case 'twitter':
        result = await postToTwitter(data);
        break;
      // Add other platforms here (Facebook, Instagram, etc.)
      default:
        result = {
          success: false,
          platform,
          error: 'Platform not supported',
        };
    }

    results.push(result);

    // Save to database if lpSlug is provided
    if (lpSlug) {
      await query.run(
        `INSERT INTO sns_posts (lp_slug, platform, post_id, content, success, error_msg, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          lpSlug,
          result.platform,
          result.postId || null,
          JSON.stringify(data),
          result.success ? 1 : 0,
          result.error || null,
        ]
      );
    }
  }

  return results;
}