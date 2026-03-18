import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getOfferById, extractUTMParams, buildUrlWithUTM } from '@affiliate/shared';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ offer_id: string }> }
) {
  const { offer_id } = await context.params;
  const offer = await getOfferById(offer_id);

  if (!offer) {
    return new NextResponse('Offer not found', { status: 404 });
  }

  const reqUrl = new URL(request.url);
  const utm = extractUTMParams(reqUrl);
  const destUrl = buildUrlWithUTM(offer.url, utm);

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const user_agent = request.headers.get('user-agent') ?? '';
  const referer = request.headers.get('referer') ?? '';

  await query.run(
    `INSERT INTO click_logs
      (offer_id, ip, user_agent, referer, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      offer_id,
      ip,
      user_agent,
      referer,
      utm.utm_source,
      utm.utm_medium,
      utm.utm_campaign,
      utm.utm_term,
      utm.utm_content
    ]
  );

  return NextResponse.redirect(destUrl, { status: 302 });
}
