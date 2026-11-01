const axios = require("axios");
const STORAGE_SERVICE_URL =
  process.env.STORAGE_SERVICE_URL || "http://localhost:5000";

exports.getCount = async () => {
  const response = await axios.get(`${STORAGE_SERVICE_URL}/api/count`);
  return response.data.count;
};

exports.incrementCount = async () => {
  const response = await axios.post(`${STORAGE_SERVICE_URL}/api/increment`);
  return response.data.count;
};
