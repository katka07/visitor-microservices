const storageClient = require("../services/storage.client");

exports.getCount = async (req, res) => {
  try {
    const count = await storageClient.getCount();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching count:", error.message);
    res
      .status(502)
      .json({ error: "Failed to fetch count from storage service" });
  }
};

exports.incrementCount = async (req, res) => {
  try {
    const count = await storageClient.incrementCount();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error incrementing count:", error.message);
    res.status(502).json({ error: "Failed to increment count" });
  }
};
