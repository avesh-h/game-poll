import { connectToDB } from "@/lib/dbHandler";
import { Game } from "@/lib/models/gameSchema";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  const requestBody = await req.json();
  try {
    await connectToDB();
    const createdGame = new Game(requestBody);
    const game = await createdGame.save();
    return NextResponse.json({ game });
  } catch (error) {
    return NextResponse.json({ error });
  }
};
