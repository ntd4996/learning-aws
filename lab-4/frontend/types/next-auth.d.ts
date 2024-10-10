import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    expires: string;
    user: {
      access_token: string;
      email: string;
      first_name: string;
      refresh_token: string;
      sub: string;
      jti: string;
      last_name: string;
      exp: number;
      expires_in: number;
      iat: number;
      id: number;
    };
  }
}
