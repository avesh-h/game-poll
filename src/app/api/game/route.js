import { connectToDB } from "@/lib/dbHandler";
import { Game } from "@/lib/models/gameSchema";
import { NextResponse } from "next/server";
import gameDao from "@/lib/daos/gameDao";

export const POST = async (req) => {
  const requestBody = await req.json();
  try {
    await connectToDB();
    const createdGame = await gameDao.createGame(requestBody);
    const game = await createdGame.save();
    return NextResponse.json(
      { message: "Succssfully Created!", game, status: "success" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error });
  }
};
