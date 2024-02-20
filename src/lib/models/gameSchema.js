const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    gameType: {
      type: String,
      required: true,
      enum: ["all", "team"],
      default: "all",
    },
    availableSeats: { type: Number, required: true },
    nameOfVenue: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    gameDate: { type: Date, default: Date.now },
    gamePassword: { type: String, required: true },
  },
  { timestamps: true }
);

export const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);
