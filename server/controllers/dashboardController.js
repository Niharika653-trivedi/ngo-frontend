const Student = require("../models/Student");
const Donor = require("../models/Donor");
const Event = require("../models/Event");
const Course = require("../models/Course");

exports.getDashboardStats = async (req, res) => {
  const [totalStudents, activeCourses, eventsConducted, donationData] =
    await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Event.countDocuments(),
      Donor.aggregate([{ $group: { _id: null, total: { $sum: "$donationAmount" } } }]),
    ]);

  const totalDonations = donationData[0]?.total || 0;
  const recentActivities = await Promise.all([
    Student.find().sort({ createdAt: -1 }).limit(3),
    Donor.find().sort({ createdAt: -1 }).limit(3),
    Event.find().sort({ createdAt: -1 }).limit(3),
  ]);

  res.json({
    cards: { totalStudents, totalDonations, activeCourses, eventsConducted },
    recentActivities: [
      ...recentActivities[0].map((i) => ({ type: "Student", message: `${i.name} enrolled` })),
      ...recentActivities[1].map((i) => ({ type: "Donor", message: `${i.donorName} donated` })),
      ...recentActivities[2].map((i) => ({ type: "Event", message: `${i.eventName} created` })),
    ].slice(0, 6),
  });
};
