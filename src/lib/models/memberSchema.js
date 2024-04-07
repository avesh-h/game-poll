import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    validate: {
      validator: (v) => {
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(v);
      },
      message: (prop) => `${prop.value} is not a valid email.`,
    },
    unique: true,
  },
  name: { type: String, required: [true, 'Name is required!'] },
  gamePassword: { type: String, required: [true, 'Password is required!'] },
  gameId: { type: mongoose.Types.ObjectId, required: true },
});

export const Member =
  mongoose.models.Member || mongoose.model('Member', memberSchema);
