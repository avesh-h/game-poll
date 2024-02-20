import mongoose from "mongoose";

//Also need to add validation check here.

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String }, //Optional
  photo: { type: String }, //Optional
});

export const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", adminSchema);

// NEXT 14 PAGES BY DEFAULT

// page.jsx ------->UI
// layout.jsx
// route.jsx ------------>API's for that perticular page
// loading.jsx
