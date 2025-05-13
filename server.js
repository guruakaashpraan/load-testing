import express from "express";
import dotenv from "dotenv";
import getLoadTestService1to1 from "./service/loadTestService.1to1.js";
dotenv.config();

const app = express();
app.use(express.json());

const server = async () => {
  try {
    console.log("Starting to run the server");
    app.listen(process.env.SERVER_PORT, async () => {
      console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    });

    await getLoadTestService1to1();

    console.log("In Between");

    console.log("End");
  } catch (error) {
    console.log("Server error", error);
    process.exit();
  }
};

server();
