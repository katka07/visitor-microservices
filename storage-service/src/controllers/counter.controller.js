const redisClient = require("../config/redis");
const COUNTER_KEY = process.env.COUNTER_KEY || "website_visitor_count";

exports.getCount = async (req, res) => {
  try {
    const count = await redisClient.get(COUNTER_KEY);
    res.status(200).json({ count: count ? parseInt(count, 10) : 0 });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};

exports.incrementCount = async (req, res) => {
  try {
    const newCount = await redisClient.incr(COUNTER_KEY);
    res.status(200).json({ count: newCount });
  } catch (error) {
    console.error("Error incrementing count:", error);
    res.status(500).json({ error: "Failed to increment count" });
  }
};
