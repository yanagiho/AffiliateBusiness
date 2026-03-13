const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type UTMParams = Record<(typeof UTM_KEYS)[number], string | null>;

export function extractUTMParams(url: URL): UTMParams {
  return Object.fromEntries(
    UTM_KEYS.map((key) => [key, url.searchParams.get(key)])
  ) as UTMParams;
}

export function buildUrlWithUTM(baseUrl: string, utm: UTMParams): string {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(utm)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}
