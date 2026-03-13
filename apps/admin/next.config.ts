import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@affiliate/shared'],
  serverExternalPackages: ['better-sqlite3'],
};

export default config;
