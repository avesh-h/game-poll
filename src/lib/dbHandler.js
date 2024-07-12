import mongoose from 'mongoose';

import { deletesExpiredGames } from './models/gameSchema';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);
  if (!process.env.DB_URI) return console.log('MONGO URI not found!');
  if (isConnected) return console.log('Already Connected to db!');

  try {
    const db = mongoose.connection;
    db.on('open', () => {
      console.log('Connected to DB!');
      //When the db connects it will check expired games and deleted from db.
      deletesExpiredGames();
    });
    mongoose.connect(process.env.DB_URI);
    isConnected = true;
  } catch (error) {
    console.log('Database connection failed!', error);
  }
};
