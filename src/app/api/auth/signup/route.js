import { connectToDB } from "@/lib/dbHandler";
import { User } from "@/lib/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req) => {
  console.log("body", await req.json());
  const { email, firstName, lastName, password, phone, photo } =
    await req.json();
  try {
    await connectToDB();
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return NextResponse.json(
        { error: "User already exist!" },
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
      return NextResponse.json(
        { message: "Successfully created!" },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
};
