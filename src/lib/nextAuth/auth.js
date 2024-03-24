import userDao from '@/lib/daos/userDao';
import { connectToDB } from '@/lib/dbHandler';
import clientPromise from '@/lib/mongoAdapter/mongoAdapter';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

//FOR GENERATE JWT
const generateJWT = async (payload) => {
  const secret = process.env.JWT_SECRET || 'secret';
  //Key only acceptes one of these symmetric secrets ['CryptoKey','Uint8Array']
  //in short we need to convert our secret key into any of these encoded text.
  const encodedKey = new TextEncoder().encode(secret);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedKey);

  return token;
};

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        //TODO:Before reach here add validation on form
        const email = credentials?.email;
        const password = credentials?.password;
        //////////////////////////////
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
              const jwt = generateJWT({
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
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token }) {
      //For just change the property name
      token.userId = token.sub;
      return token;
    },
    async session({ session, token }) {
      //Add user id in the session so we can access in the project
      if (session && session.user) {
        session.user.id = token.sub;
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
