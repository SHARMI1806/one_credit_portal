import express, { request, response } from "express";
import onecreditmaster from "./model.js";

const router = express.Router();
router.get("/", async (request, response) => {
  try {
    const courseMaster = await onecreditmaster.find({});
    return response.status(200).json(courseMaster);
  } catch (error) {
    console.error("Error getting data:", error);
    return response.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
