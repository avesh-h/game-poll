import { connectToDB } from "@/lib/dbHandler";

const { User } = require("@/lib/models/userSchema");
const { NextResponse } = require("next/server");

export const POST = async (req) => {
  const requestBody = await req.json();
  await connectToDB();
  const isUserExist = await User.find({ email: requestBody.email });
  if (isUserExist) {
    return NextResponse.json(
      { error: "User aleready exist!" },
      { status: 400 }
    );
  } else {
    const createUser = new User(requestBody);
    try {
      await createUser.save();
      return NextResponse.json(
        { message: "Successfully created!" },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
  }
};
