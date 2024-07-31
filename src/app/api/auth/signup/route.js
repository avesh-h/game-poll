import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import { connectToDB } from '@/lib/dbHandler';
import { User } from '@/lib/models/userSchema';

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
      await createUser.save();
      //Send email process for the verification
      return NextResponse.json(
        { message: 'Successfully created!', status: 'success' },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
};
