const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    objectives: { type: String, required: true, trim: true },
    participants: { type: Number, required: true, min: 0 },
    outcomes: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
