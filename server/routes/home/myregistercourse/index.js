import express from "express";
import RegisteredCourse from "../../registercourse/model.js";

const router = express.Router();

router.get("/:rollno", async (request, response) => {
  try {
    const { rollno } = request.params;
    
    const courseCount = await RegisteredCourse.aggregate([
      {
        $match: { rollno: rollno }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    const count = courseCount.length > 0 ? courseCount[0].count : 0;

    response.status(200).send({ count });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

export default router;
