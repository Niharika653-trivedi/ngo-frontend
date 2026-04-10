const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const protect = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorMiddleware");
const createCrudController = require("./controllers/crudController");
const createCrudRoutes = require("./routes/crudRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const Student = require("./models/Student");
const Donor = require("./models/Donor");
const Event = require("./models/Event");
const Course = require("./models/Course");

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const explicit = process.env.CLIENT_URL;
      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
      if ((explicit && origin === explicit) || isLocalhost) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use(
  "/api/students",
  protect,
  createCrudRoutes(createCrudController(Student, ["name", "contact", "courseEnrolled"]))
);
app.use(
  "/api/donors",
  protect,
  createCrudRoutes(createCrudController(Donor, ["donorName", "relatedActivity", "contactInfo"]))
);
app.use(
  "/api/events",
  protect,
  createCrudRoutes(createCrudController(Event, ["eventName", "description", "objectives"]))
);
app.use("/api/courses", protect, createCrudRoutes(createCrudController(Course, ["title"])));
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
