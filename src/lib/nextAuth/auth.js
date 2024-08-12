import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import clientPromise from '../mongoAdapter/mongoAdapter';
import { sendMail } from '../oAuth2';
import { generateToken } from '../utils/generateToken';
import userDao from '@/lib/daos/userDao';
import { connectToDB } from '@/lib/dbHandler';

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
            throw new Error('User does not Exist!');
          } else {
            //Also check is user is verified account or not
            if (!existedUser?.isVerified) {
              //Generate token for verify
              const verificationToken = await generateToken(
                {
                  email: existedUser?.email,
                  userId: existedUser?._id,
                },
                { secret: process.env.VERIFY_SECRET, duration: '30m' }
              );

              // verification link
              const verificationLink =
                process.env.SERVER_URL + '/verify-email/' + verificationToken;

              //Send email for verify the user
              const mailOptions = {
                mailTo: existedUser?.email,
                subject: 'User verification.',
                verificationLink,
                // html: `<h5> Click to Verification Link : ${verificationLink}</h5>`,
              };
              await sendMail(mailOptions);
              throw new Error(
                'Your account is not verified yet! We send you the mail, Please click on the link and verify the email.'
              );
            }
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
              const payload = {
                email: existedUser?.email,
                userId: existedUser?._id,
              };
              const jwt = await generateToken(payload);
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
    // Seconds - How long until an idle session expires and is no longer valid
    maxAge: 24 * 60 * 60, //Session expiry  (we can set in seconds)
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
    jwt: async ({ user, token }) => {
      //For just change the property name
      if (user) {
        token.userId = token.sub;
        token.jwtToken = user.token;
      }
      return token;
    },

    session: async ({ session, token }) => {
      if (session?.user && token?.jwtToken) {
        session.user.id = token.sub;
        session.user.token = token.jwtToken;
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
