"use server";

import { connectToDB } from "../dbHandler";
import { AdminUser } from "../models/adminSchema";
import { NextResponse } from "next/server";

export const createAdmin = async (req, res) => {
  try {
    await connectToDB();
    //Check user is alerady exist or not.

    const adminUser = new AdminUser(req.body);
    await adminUser.save();
    return res.status(200).send(adminUser);
  } catch (error) {
    console.log(error);
  }
  return new NextResponse(req.body);
};

export const welcomeToHome = (req, res) => {
  res.send("welcome to home");
};
