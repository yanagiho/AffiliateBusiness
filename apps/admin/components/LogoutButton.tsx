'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-sm text-gray-500 hover:text-gray-700"
    >
      ログアウト
    </button>
  );
}