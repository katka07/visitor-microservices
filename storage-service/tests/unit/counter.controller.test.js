jest.mock("../../src/config/redis", () => ({
  get: jest.fn(),
  incr: jest.fn(),
}));

const redisClient = require("../../src/config/redis");
const counterController = require("../../src/controllers/counter.controller");

describe("Counter Controller - Storage Service (Unit)", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getCount", () => {
    it("returns parsed count when redis has a value", async () => {
      redisClient.get.mockResolvedValue("5");

      await counterController.getCount(req, res);

      expect(redisClient.get).toHaveBeenCalledWith("website_visitor_count");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 5 });
    });

    it("returns 0 when redis has no value yet", async () => {
      redisClient.get.mockResolvedValue(null);

      await counterController.getCount(req, res);

      expect(res.json).toHaveBeenCalledWith({ count: 0 });
    });

    it("returns 500 when redis throws an error", async () => {
      redisClient.get.mockRejectedValue(new Error("Redis connection lost"));

      await counterController.getCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch count" });
    });
  });

  describe("incrementCount", () => {
    it("returns incremented count", async () => {
      redisClient.incr.mockResolvedValue(1);

      await counterController.incrementCount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 1 });
    });

    it("returns 500 when redis throws an error", async () => {
      redisClient.incr.mockRejectedValue(new Error("Redis connection lost"));

      await counterController.incrementCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to increment count",
      });
    });
  });
});
