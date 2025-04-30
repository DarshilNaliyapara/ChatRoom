import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import express from "express";
import connectDB from "./database/connect.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on: ${process.env.APP_URI}:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error", err);
  });
