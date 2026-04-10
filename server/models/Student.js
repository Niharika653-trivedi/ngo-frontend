const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    disabilityType: { type: String, required: true },
    courseEnrolled: { type: String, required: true },
    enrollmentDate: { type: Date, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
