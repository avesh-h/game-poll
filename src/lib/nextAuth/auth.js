import userDao from '@/lib/daos/userDao';
import { connectToDB } from '@/lib/dbHandler';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '../mongoAdapter/mongoAdapter';

//FOR GENERATE JWT
const generateJWT = async (payload) => {
  const secret = process.env.NEXTAUTH_SECRET || 'secret';
  //Key only acceptes one of these symmetric secrets ['CryptoKey','Uint8Array']
  //in short we need to convert our secret key into any of these encoded text.
  const encodedKey = new TextEncoder().encode(secret);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5 min')
    .sign(encodedKey);

  return token;
};

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      //With DB adapter
      async authorize(credentials) {
        //TODO:Before reach here add validation on form
        const email = credentials?.email;
        const password = credentials?.password;
        ///////////////////////////////////////////////
        try {
          await connectToDB();
          const existedUser = await userDao.findUserByEmail(email);

          if (!existedUser) {
            //User not exist
            throw new Error("User doesn't Exist!");
          } else {
            //Compare password
            const isPasswordCorrect = await bcrypt.compare(
              password,
              existedUser.password
            );
            if (!isPasswordCorrect) {
              //Password wrong
              throw new Error('Invalid Credentials!');
            } else {
              //generate JWT
              const jwt = await generateJWT({
                email: existedUser?.email,
                userId: existedUser?._id,
              });

              return {
                id: existedUser?._id,
                name: `${existedUser?.firstName} ${existedUser?.lastName}`,
                email: existedUser?.email,
                token: jwt,
              };
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 1 * 60 * 60, //Session expiry  (we can set in seconds)
  },
  secret: process.env.NEXTAUTH_SECRET,
  // jwt: {
  //   maxAge: 1 * 60,
  //   async encode({ secret, token }) {
  //     console.log('secret11', { secret, token });
  //     const genToken = jwt.sign(token, secret, {
  //       expiresIn: '10m',
  //     });
  //     console.log('jjjjj', genToken);
  //     return genToken;
  //   },
  //   async decode({ secret, token, maxAge }) {
  //     console.log('maxAge', maxAge);
  //     console.log('authOptions', token);
  //     return jwt.verify(token, secret, { algorithms: ['HS256'] });
  //   },
  // },

  callbacks: {
    async jwt({ token, user }) {
      //For just change the property name
      token.userId = token.sub;
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.token = token;
      }
      return session;
    },
  },
  //For my own custom page
  pages: {
    signIn: '/login',
  },
};

export const getCurrentSession = () => getServerSession(authOptions);
