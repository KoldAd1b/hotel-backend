const whitelist = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "http://127.0.0.1:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = {
  corsOptions,
  whitelist,
};
