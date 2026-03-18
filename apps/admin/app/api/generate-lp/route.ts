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

    // Create slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Save to database
    const result = await query.run(
      `INSERT INTO lp_configs (slug, title, description, target_audience, offer_id, content, keywords, genre, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        slug,
        body.title,
        body.description,
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
      // Get selected accounts
      const accounts = await query.all(
        `SELECT id, platform, account_name, api_key, api_secret, access_token, access_secret
         FROM sns_accounts
         WHERE id IN (${selectedAccountIds.map(() => '?').join(',')}) AND is_active = 1`,
        selectedAccountIds
      );

      // Post to each selected account
      const platforms = accounts.map((account: any) => account.platform);
      snsResults = await postToMultipleSNS({
        title: lpContent.title,
        description: lpContent.subheadline,
        url: lpUrl,
        hashtags: body.keywords,
        targetAudience: body.targetAudience,
      }, platforms, slug);
    }

    return NextResponse.json({
      success: true,
      slug,
      content: lpContent,
      snsResults,
    });
  } catch (error) {
    console.error('LP generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate LP content' },
      { status: 500 }
    );
  }
}