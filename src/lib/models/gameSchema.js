import mongoose from 'mongoose';
import schedule from 'node-schedule';

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
      min: [6, 'Must be at least 4, got {VALUE}'],
      max: 30,
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
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
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
    gameStatus: {
      type: String,
      enum: ['pending', 'expired'],
      default: 'pending',
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
        team: { type: String },
        playerIndex: { type: Number }, //Only for the team array index UI position
        memberIndex: { type: Number }, //Only for the main array index UI position
      },
    ],
  },
  { timestamps: true }
);

//TTL index
// Example
// gameSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// console.log('indexes', gameSchema.indexes());

//Define CRON
// cron.schedule('* 1 * * * *', () => {
//   console.log('call on every second on server', new Date());
// });

//Define Schedule
const scheduleDeletionJob = (game) => {
  const endtime = game.endTime;
  const now = new Date();
  if (endtime > now) {
    schedule.scheduleJob(endtime, async () => {
      try {
        await Game.findByIdAndDelete(game._id);
      } catch (error) {
        console.log('Schedule error', error);
      }
    });
  } else {
    //If the game setted past date then it should be deleted immedietely
    Game.findByIdAndDelete(game._id)
      .then(() => {
        console.log(`Deleted game: ${game._id}`);
      })
      .catch((error) => {
        console.error(`Error deleting game: ${game._id}`, error);
      });
  }
};

// When a new game is created or updated, schedule its deletion
gameSchema.post('save', function (doc) {
  scheduleDeletionJob(doc);
});

// Function to reschedule all pending deletions on startup of server and start db after restart server
// rescheduleAllDeletions queries for all game documents with future endTime and reschedules their deletion jobs. This function is called when the server starts to ensure that no pending deletions are missed due to server restarts or deployment.
export const rescheduleAllDeletions = async () => {
  try {
    const games = await Game.find({ endTime: { $gt: new Date() } });
    games.forEach(scheduleDeletionJob);
  } catch (error) {
    console.error('Error rescheduling deletions:', error);
  }
};

//Set default property
gameSchema.path('members').default([]);

export const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

// NOTE: If the member with same email and different gameID isn't create then check into the db that the uniqueIndex is not have set on the email in compass.

// OR Use dropIndex like this db.members.dropIndex("email_1")
