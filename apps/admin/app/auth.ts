import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// 複数ユーザー対応: ADMIN_USERS 環境変数 (JSON) またはフォールバック
function getAdminUsers(): Array<{ username: string; password: string; name: string }> {
  const usersJson = process.env.ADMIN_USERS;
  if (usersJson) {
    try {
      return JSON.parse(usersJson);
    } catch {
      // パース失敗時はフォールバック
    }
  }
  // 旧形式の環境変数にもフォールバック
  return [
    {
      username: process.env.ADMIN_USERNAME ?? 'admin',
      password: process.env.ADMIN_PASSWORD ?? 'password',
      name: 'Admin',
    },
  ];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const users = getAdminUsers();
        const matched = users.find(
          (u) =>
            credentials.username === u.username &&
            credentials.password === u.password
        );
        if (matched) {
          return {
            id: matched.username,
            name: matched.name,
            email: `${matched.username}@affiliate.local`,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});