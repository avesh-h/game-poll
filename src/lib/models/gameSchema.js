import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    gameType: {
      type: String,
      enum: ["all", "team"],
      default: "all",
    },
    gameName: {
      type: String,
    },
    noOfPlayers: {
      type: Number,
      required: [true, "Number of seats are require."],
      min: [4, "Must be at least 4, got {VALUE}"],
      max: 12,
    },
    nameOfVenue: {
      type: String,
      required: [true, "Name of venue is require."],
    },
    startTime: {
      type: String,
      required: [true, "Start time of game is require."],
    },
    endTime: { type: String, required: [true, "End time of game is require."] },
    gameDate: {
      type: Date,
      default: Date.now,
      required: [true, "Date of the game is require."],
    },
    gamePassword: {
      type: String,
      required: [true, "Need password for set the game."],
    },
    totalAmount: {
      type: Number,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

//Set default property
gameSchema.path("members").default([]);

export const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);
