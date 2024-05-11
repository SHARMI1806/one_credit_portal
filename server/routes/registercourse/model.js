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
  semester: {
    type: String,
    required: true,
  },
  coursename1: {
    type: String,
    required: true,
  },
  course1completedsemester: {
    type: String,
    required: true,
  },
  coursename2: {
    type: String,
    required: true,
  },
  course2completedsemester: {
    type: String,
    required: true,
  },
  coursename3: {
    type: String,
    required: true,
  },
  course3completedsemester: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  approvalstatus: {
    type: String,
  },
  eligiblitystatus: {
    type: String,
  },
});

export default mongoose.model("registeredcourse", courseSchema);
