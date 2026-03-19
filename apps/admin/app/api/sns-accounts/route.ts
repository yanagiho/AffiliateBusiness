import { NextRequest, NextResponse } from 'next/server';
import { query } from '@affiliate/shared';

export async function GET() {
  try {
    const accounts = await query.all(
      `SELECT id, platform, account_name, theme, character_name, character_role,
              character_bio, character_tone, post_format, cta_style,
              forbidden_expressions, visual_direction, is_active
       FROM sns_accounts ORDER BY theme, platform`
    );
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching SNS accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch SNS accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // JSONインポート（{ accounts: [...] } 形式）
    if (body.accounts && Array.isArray(body.accounts)) {
      let inserted = 0;
      for (const account of body.accounts) {
        await query.run(
          `INSERT INTO sns_accounts
            (platform, account_name, theme, character_name, character_role,
             character_bio, character_tone, post_format, cta_style,
             forbidden_expressions, visual_direction, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            account.platform,
            account.account_name,
            account.theme,
            account.character_name,
            account.character_role,
            account.character_bio,
            account.character_tone,
            account.post_format,
            account.cta_style,
            account.forbidden_expressions,
            account.visual_direction,
          ]
        );
        inserted++;
      }
      return NextResponse.json({ success: true, inserted });
    }

    // 単体登録
    const {
      platform, account_name, theme, character_name, character_role,
      character_bio, character_tone, post_format, cta_style,
      forbidden_expressions, visual_direction,
      api_key, api_secret, access_token, access_secret,
    } = body;

    await query.run(
      `INSERT INTO sns_accounts
        (platform, account_name, theme, character_name, character_role,
         character_bio, character_tone, post_format, cta_style,
         forbidden_expressions, visual_direction,
         api_key, api_secret, access_token, access_secret, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        platform, account_name, theme, character_name, character_role,
        character_bio, character_tone, post_format, cta_style,
        forbidden_expressions, visual_direction,
        api_key || null, api_secret || null, access_token || null, access_secret || null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving SNS account:', error);
    return NextResponse.json({ error: 'Failed to save SNS account' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, api_key, api_secret, access_token, access_secret, is_active } = body;

    await query.run(
      `UPDATE sns_accounts
       SET api_key = ?, api_secret = ?, access_token = ?, access_secret = ?, is_active = ?
       WHERE id = ?`,
      [api_key || null, api_secret || null, access_token || null, access_secret || null,
       is_active ? 1 : 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating SNS account:', error);
    return NextResponse.json({ error: 'Failed to update SNS account' }, { status: 500 });
  }
}
