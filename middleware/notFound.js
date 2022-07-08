const notFound = (req, res) =>
  res.status(404).json({ message: "The following route does not exist" });

module.exports = notFound;
