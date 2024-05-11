import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  rollno: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  currentsemester: {
    type: String,
    required: true,
  },
  completedsemester: {
    type: String,
    required: true,
  },
  courseid: {
    type: String,
    required: true,
  },
  coursename: {
    type: String,
    required: true,
  },
});

export default mongoose.model("onecreditmaster", courseSchema);
