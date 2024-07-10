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
    jobId: {
      type: Number,
      default: null,
    },
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

//Create cron task
gameSchema.post('save', async function (doc) {
  if (!doc?.jobId) {
    const endTimeUTC = new Date(doc.endTime);
    const gameId = doc._id.toString();

    // Convert endTime to Asia/Kolkata timezone
    const endTimeLocal = dayjs(endTimeUTC).tz('Asia/Kolkata');

    //Expiry Cron
    const cronExpiryTime = dayjs(doc.endTime).tz('Asia/Kolkata');

    // Format expiresAt in the required format YYYYMMDDHHmmss in Interger
    const expiresAt = Number(cronExpiryTime?.format('YYYYMMDDHHmmss'));

    // Extract the correct local time components
    const minutes = endTimeLocal.minute();
    const hours = endTimeLocal.hour();
    const mdays = endTimeLocal.date();
    const months = endTimeLocal.month() + 1; // Day.js months are 0-indexed
    const wdays = endTimeLocal.day();

    // Create a new cron job on cron-job.org
    const response = await axios.put(
      'https://api.cron-job.org/jobs',
      {
        job: {
          url: `${process.env.NEXTAUTH_URL}/api/execute-cron/${gameId}`,
          // url: `https://e10b-103-240-76-116.ngrok-free.app/api/execute-cron/${gameId}`,
          // url: `https://play-o-time.onrender.com/api/execute-cron/${gameId}`,
          enabled: true,
          saveResponses: true,
          schedule: {
            timezone: 'Asia/Kolkata',
            expiresAt,
            minutes: [minutes],
            hours: [hours],
            mdays: [mdays],
            months: [months],
            wdays: [wdays],
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

    //Add virtual property
    doc.jobId = response?.data?.jobId;
    await doc.save(); // Save the updated document with jobId
  }
});

//Update cron task
gameSchema.post('findOneAndUpdate', async function (doc) {
  const endTimeUTC = new Date(doc.endTime);

  // Convert endTime to Asia/Kolkata timezone
  const endTimeLocal = dayjs(endTimeUTC).tz('Asia/Kolkata');

  //Expiry Cron
  const cronExpiryTime = dayjs(doc.endTime).tz('Asia/Kolkata');

  // Format expiresAt in the required format YYYYMMDDHHmmss in Interger
  const expiresAt = Number(cronExpiryTime?.format('YYYYMMDDHHmmss'));

  // Extract the correct local time components
  const minutes = endTimeLocal.minute();
  const hours = endTimeLocal.hour();
  const mdays = endTimeLocal.date();
  const months = endTimeLocal.month() + 1; // Day.js months are 0-indexed
  const wdays = endTimeLocal.day();

  const gameId = doc?._id?.toString();
  const jobId = doc?.jobId;

  await axios.patch(
    `https://api.cron-job.org/jobs/${jobId}`,
    {
      job: {
        url: `${process.env.NEXTAUTH_URL}/api/execute-cron/${gameId}`,
        // url: `https://e10b-103-240-76-116.ngrok-free.app/api/execute-cron/${gameId}`,
        // url: `https://play-o-time.onrender.com/api/execute-cron/${gameId}`,
        enabled: true,
        schedule: {
          timezone: 'Asia/Kolkata',
          expiresAt,
          minutes: [minutes],
          hours: [hours],
          mdays: [mdays],
          months: [months],
          wdays: [wdays],
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
});

//Update cron task
gameSchema.post('findOneAndDelete', async function (doc) {
  const jobId = doc?.jobId;

  await axios.delete(
    `https://api.cron-job.org/jobs/${jobId}`,

    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.CRON_JOB_KEY,
      },
    }
  );
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
