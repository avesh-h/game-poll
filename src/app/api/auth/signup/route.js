import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { User } from '@/lib/models/userSchema';
import { sendMail } from '@/lib/oAuth2';
import { generateToken } from '@/lib/utils/generateToken';

export const POST = async (req) => {
  const { email, firstName, lastName, password, phone, photo } =
    await req.json();
  try {
    await connectToDB();
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return NextResponse.json(
        { error: 'User already exist!' },
        { status: 400 }
      );
    } else {
      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createUser = await User.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phone,
        photo,
      });
      const registeredUser = await createUser.save();
      if (registeredUser) {
        //Generate token for verify
        const verificationToken = await generateToken(
          {
            email: registeredUser?.email || email,
            userId: registeredUser?._id,
          },
          { secret: process.env.VERIFY_SECRET, duration: '30m' }
        );

        // verification link
        const verificationLink =
          process.env.SERVER_URL + '/verify-email/' + verificationToken;

        //Send email for verify the user
        const mailOptions = {
          mailTo: registeredUser?.email || email,
          subject: 'User verification.',
          verificationLink,
          // html: `<h5> Click to Verification Link : ${verificationLink}</h5>`,
        };
        await sendMail(mailOptions);
        return NextResponse.json(
          {
            message: 'We send you the email for verification!',
            status: 'success',
          },
          { status: 201 }
        );
      }
      return NextResponse.json(
        { error: 'Something went wrong!', status: 'failed' },
        { status: httpStatusCode.INTERNAL_SERVER_ERROR }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
};
