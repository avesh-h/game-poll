import mongoose from 'mongoose';

//Also need to add validation check here.

//Always remember whenever you making change in schema don't forget to restart the project because the changes will be work after restart for the models.

// This Schema is about the user that register in to create game.

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
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
  firstName: { type: String, required: [true, 'First Name is required!'] },
  lastName: { type: String, required: [true, 'Last Name is required!'] },
  password: { type: String, required: [true, 'Password is required!'] },
  phone: { type: String }, //Optional
  photo: { type: String }, //Optional
});

//Also can check validate like this
// userSchema.path("email").validate();

export const User =
  mongoose.models?.Users || mongoose.model('Users', userSchema);
