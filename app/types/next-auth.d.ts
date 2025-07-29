import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  // session.user の型を拡張
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  // JWT トークンの型を拡張
  interface JWT {
    id: string;
  }
}