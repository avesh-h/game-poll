import mongoose from "mongoose";

//Also need to add validation check here.

// This Schema is about the user that register in to create game.

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(v);
      },
      message: (prop) => `${prop.value} is not a valid email.`,
    },
  },
  firstName: { type: String, required: [true, "First Name is required!"] },
  lastName: { type: String, required: [true, "Last Name is required!"] },
  phone: { type: String }, //Optional
  photo: { type: String }, //Optional
});

//Also can check validate like this
// userSchema.path("email").validate();

export const User = mongoose.models.User || mongoose.model("Users", userSchema);
