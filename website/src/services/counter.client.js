const axios = require("axios");
const COUNTER_SERVICE_URL =
  process.env.COUNTER_SERVICE_URL || "http://localhost:4000";

exports.incrementAndGetCount = async () => {
  const response = await axios.post(`${COUNTER_SERVICE_URL}/api/increment`);
  return response.data.count;
};
