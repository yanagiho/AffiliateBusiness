import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // シンプルな認証: 固定ユーザー
        if (
          credentials.username === 'admin' &&
          credentials.password === 'password'
        ) {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@example.com',
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