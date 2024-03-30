import { authOptions } from '@/lib/nextAuth/auth';
import NextAuth from 'next-auth/next';

// For advance options
// export default async function auth(req, res) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   return await NextAuth(req, res, {
//     ...
//   })
// }

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
