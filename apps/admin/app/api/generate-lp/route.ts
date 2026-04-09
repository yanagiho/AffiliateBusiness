import { NextRequest, NextResponse } from 'next/server';
import { generateLPContent, LPGenerationRequest, postToMultipleSNS } from '@affiliate/shared';
import { query } from '@affiliate/shared';

export async function POST(request: NextRequest) {
  try {
    const body: LPGenerationRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.targetAudience || !body.offerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate LP content using Claude
    const lpContent = await generateLPContent(body);

    // Create slug from title (fallback to timestamp if title is non-ASCII only)
    let slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!slug) {
      slug = `lp-${Date.now()}`;
    }

    // Save to database (omit timestamps; rely on column DEFAULTs)
    await query.run(
      `INSERT INTO lp_configs (slug, title, description, config, target_audience, offer_id, content, keywords, genre)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        body.title,
        body.description,
        '{}',
        body.targetAudience,
        body.offerId,
        JSON.stringify(lpContent),
        JSON.stringify(body.keywords),
        (body as any).genre || null,
      ]
    );

    // Post to selected SNS platforms
    const lpUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/lp/${slug}`;
    const selectedAccountIds = (body as any).snsAccountIds || [];

    let snsResults: any[] = [];
    if (selectedAccountIds.length > 0) {
      // Get selected accounts with character info
      const accounts = await query.all(
        `SELECT id, platform, account_name, theme, character_name, character_role,
                character_bio, character_tone, post_format, cta_style,
                forbidden_expressions, visual_direction,
                api_key, api_secret, access_token, access_secret
         FROM sns_accounts
         WHERE id IN (${selectedAccountIds.map(() => '?').join(',')}) AND is_active`,
        selectedAccountIds
      );

      snsResults = await postToMultipleSNS({
        title: lpContent.title,
        description: lpContent.subheadline,
        url: lpUrl,
        hashtags: body.keywords,
        targetAudience: body.targetAudience,
      }, accounts as any[], slug);
    }

    return NextResponse.json({
      success: true,
      slug,
      lpUrl,
      content: lpContent,
      snsResults,
    });
  } catch (error) {
    console.error('LP generation error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to generate LP content', detail: message },
      { status: 500 }
    );
  }
}