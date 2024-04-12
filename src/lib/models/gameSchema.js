import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    gameType: {
      type: String,
      enum: ['all', 'team'],
      default: 'all',
    },
    gameName: {
      type: String,
    },
    noOfPlayers: {
      type: Number,
      required: [true, 'Number of seats are require.'],
      min: [4, 'Must be at least 4, got {VALUE}'],
      max: 12,
    },
    nameOfVenue: {
      type: String,
      required: [true, 'Name of venue is require.'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time of game is require.'],
    },
    endTime: { type: Date, required: [true, 'End time of game is require.'] },
    gameDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Date of the game is require.'],
    },
    gamePassword: {
      type: String,
      required: [true, 'Need password for set the game.'],
    },
    totalAmount: {
      type: Number,
    },
    totalHours: {
      type: Number,
    },
    members: [
      {
        _id: false,
        id: { type: mongoose.Schema.ObjectId },
        playerName: String,
        role: { type: String, enum: ['organizer', 'member'] },
        position: String,
        email: String,
        gameId: { type: mongoose.Schema.ObjectId },
      },
    ],
  },
  { timestamps: true }
);

//Set default property
gameSchema.path('members').default([]);

export const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

// NOTE: If the member with same email and different gameID isn't create then check into the db that the uniqueIndex is not have set on the email in compass.

// OR Use dropIndex like this db.members.dropIndex("email_1")
