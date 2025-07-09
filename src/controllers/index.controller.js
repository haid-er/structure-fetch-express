const defaultController = (req, res) => {
  res.json({ message: "Hello from server." });
};

module.exports = { defaultController };
