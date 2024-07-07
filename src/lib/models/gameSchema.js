import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import mongoose from 'mongoose';
// import cron from 'node-cron';
// import schedule from 'node-schedule';

import AppConfig from '../utils/app-config';

dayjs.extend(utc);
dayjs.extend(timezone);

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
    note: { type: String },
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
// const cronScheduleJob = (doc) => {
//   const endDate = getDateIntoCronExpression(doc.endTime);
//   console.log('expression', endDate);
//   cron.schedule(endDate, () => {
//     console.log('cron-job===========================>', endDate);
//   });
// };

//Define Schedule
// const scheduleDeletionJob = (game) => {
//   const endtime = game.endTime;
//   const now = new Date();
//   if (endtime > now) {
//     schedule.scheduleJob(endtime, async () => {
//       try {
//         await Game.findByIdAndDelete(game._id);
//       } catch (error) {
//         console.log('Schedule error', error);
//       }
//     });
//   } else {
//     //If the game setted past date then it should be deleted immedietely
//     Game.findByIdAndDelete(game._id)
//       .then(() => {
//         console.log(`Deleted game: ${game._id}`);
//       })
//       .catch((error) => {
//         console.error(`Error deleting game: ${game._id}`, error);
//       });
//   }
// };

//Adding property in document virtually
// The virtual property will be not available in the db but it will be present in the doc

gameSchema.virtual('registerLink').get(function () {
  return `${AppConfig?.[process.env.NODE_ENV]?.apiUrl}/members/${this?._id}`;
});

//By default the virtual property will be not sent to the front end so in below we make sure it should send.
gameSchema.set('toJSON', { virtuals: true });

//If we want to mongoose document convert into the plain javascript object and we want to include this virtual property into the object then set 'toObject' setter useful.
gameSchema.set('toObject', { virtuals: true });

// When a new game is created or updated, schedule its deletion
// gameSchema.post('save', function (doc) {
//   scheduleDeletionJob(doc);
//   // cronScheduleJob(doc);
// });

// cron-job.org implementation
gameSchema.post('save', async function (doc) {
  const endTime = new Date(doc.endTime);
  const gameId = doc._id.toString();

  //Expiry Cron
  const cronExpiryTime = dayjs(doc.endTime).tz('Asia/Kolkata');

  // Format expiresAt in the required format YYYYMMDDHHmmss in Interger
  const expiresAt = Number(cronExpiryTime?.format('YYYYMMDDHHmmss'));

  console.log('schedule', {
    endTime,
    expiresAt,
    minutes: [endTime.getMinutes()],
    hours: [endTime.getHours()],
    mdays: [endTime.getDate()],
    months: [endTime.getMonth() + 1],
    wdays: [endTime.getDay()],
  });
  // Create a new cron job on cron-job.org
  await axios.put(
    'https://api.cron-job.org/jobs',
    {
      job: {
        url: `${process.env.NEXTAUTH_URL}/api/execute-cron/${gameId}`,
        // url: `https://9fa8-2402-a00-172-d9f4-28f8-3099-58fb-6e7d.ngrok-free.app/api/execute-cron/${gameId}`,
        // url: `https://play-o-time.onrender.com/api/execute-cron/${gameId}`,
        enabled: true,
        saveResponses: true,
        schedule: {
          timezone: 'Asia/Kolkata',
          expiresAt,
          minutes: [endTime.getMinutes()],
          hours: [endTime.getHours()],
          mdays: [endTime.getDate()],
          months: [endTime.getMonth() + 1],
          wdays: [endTime.getDay()],
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.CRON_JOB_KEY,
      },
    }
  );
  // https://api.cron-job.org
});

// Function to reschedule all pending deletions on startup of server and start db after restart server
// rescheduleAllDeletions queries for all game documents with future endTime and reschedules their deletion jobs. This function is called when the server starts to ensure that no pending deletions are missed due to server restarts or deployment.
// export const rescheduleAllDeletions = async () => {
//   try {
//     const games = await Game.find({ endTime: { $gt: new Date() } });
//     games.forEach(scheduleDeletionJob);
//   } catch (error) {
//     console.error('Error rescheduling deletions:', error);
//   }
// };

//Set default property
gameSchema.path('members').default([]);

export const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

// NOTE: If the member with same email and different gameID isn't create then check into the db that the uniqueIndex is not have set on the email in compass.

// OR Use dropIndex like this db.members.dropIndex("email_1")
