import express from "express";
import Creditcourse from "./model.js";
const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const totalcourse = await Creditcourse.countDocuments();
    response.status(200).json({ totalcourse });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
