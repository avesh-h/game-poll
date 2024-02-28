import { connectToDB } from "@/lib/dbHandler";
import { User } from "@/lib/models/userSchema";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req) => {
  const { email, password } = await req.json();
  try {
    await connectToDB();
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return NextResponse.json(
        { message: "User does not exist!" },
        { status: 400 }
      );
    } else {
      //Compare password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existedUser.password
      );
      if (isPasswordCorrect) {
        //JWT
        const userData = {
          email: existedUser?.email,
          userId: existedUser?._id,
        };
        const accessToken = jwt.sign(
          userData,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = jwt.sign(
          userData,
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "24h" }
        );
        const response = NextResponse.json(
          { accessToken, refreshToken },
          { status: 200 }
        );
        response.cookies.set("refresh_token", refreshToken);
        return response;
      } else {
        //Password wrong
        return NextResponse.json(
          { message: "Incorrect password!" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
};
