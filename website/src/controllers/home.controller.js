const os = require("os");
const counterClient = require("../services/counter.client");

exports.renderHome = async (req, res) => {
  try {
    const count = await counterClient.incrementAndGetCount();
    res.render("index", {
      count,
      error: null,
      hostname: os.hostname(),
    });
  } catch (error) {
    console.error("Error fetching visitor count:", error.message);
    res.render("index", {
      count: null,
      error: "Unable to fetch visitor count right now.",
      hostname: os.hostname(),
    });
  }
};
