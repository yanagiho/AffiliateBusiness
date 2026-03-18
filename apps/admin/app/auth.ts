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
        const adminUser = process.env.ADMIN_USERNAME ?? 'admin';
        const adminPass = process.env.ADMIN_PASSWORD ?? 'password';
        if (
          credentials.username === adminUser &&
          credentials.password === adminPass
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