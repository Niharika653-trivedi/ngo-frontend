const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    donationAmount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    relatedActivity: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);
