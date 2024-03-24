import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);
  if (!process.env.DB_URI) return console.log('MONGO URI not found!');
  if (isConnected) return console.log('Already Connected to db!');

  try {
    const db = mongoose.connection;
    db.on('open', () => {
      console.log('Connected to DB!');
    });
    mongoose.connect(process.env.DB_URI);
    isConnected = true;
  } catch (error) {
    console.log('------------------------>', error);
  }
};
