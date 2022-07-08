require("dotenv").config();
require("express-async-errors");
const path = require("path");
const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// // Routes
const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotels");
const userRoutes = require("./routes/users");
const roomRoutes = require("./routes/rooms");
// Connecting to database
const connectDB = require("./db/connect");
// Middleware
const notFound = require("./middleware/notFound");
const errorMiddleware = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const { corsOptions } = require("./configCors/corsOptions");
const allowCredentials = require("./middleware/allowCredentials");

app.use(allowCredentials);

app.use(cors(corsOptions));
// // Logging MiddleWare
app.use(morgan("tiny"));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// All routes here

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/rooms", roomRoutes);

app.use(notFound);

app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_DB_URI_STRING);
    app.listen(PORT, console.log("Server listening on port " + PORT));
  } catch (error) {
    throw error;
  }
};

startServer();
