jest.mock("../../src/services/storage.client", () => ({
  getCount: jest.fn(),
  incrementCount: jest.fn(),
}));

const storageClient = require("../../src/services/storage.client");
const counterController = require("../../src/controllers/counter.controller");

describe("Counter Controller - Counter Service (Unit)", () => {
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
    it("returns count from storage client", async () => {
      storageClient.getCount.mockResolvedValue(15);

      await counterController.getCount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 15 });
    });

    it("returns 502 when storage service call fails", async () => {
      storageClient.getCount.mockRejectedValue(new Error("Network error"));

      await counterController.getCount(req, res);

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch count from storage service",
      });
    });
  });

  describe("incrementCount", () => {
    it("returns incremented count from storage client", async () => {
      storageClient.incrementCount.mockResolvedValue(16);

      await counterController.incrementCount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 16 });
    });

    it("returns 502 when storage service call fails", async () => {
      storageClient.incrementCount.mockRejectedValue(
        new Error("Network error"),
      );

      await counterController.incrementCount(req, res);

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to increment count",
      });
    });
  });
});
