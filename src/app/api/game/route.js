import { connectToDB } from "@/lib/dbHandler";
import { Game } from "@/lib/models/gameSchema";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  const requestBody = await req.json();
  const createdGame = new Game(requestBody);
  try {
    await connectToDB();
    const game = await createdGame.save();
    return new NextResponse(game);
  } catch (error) {
    return new NextResponse(error);
  }
};
