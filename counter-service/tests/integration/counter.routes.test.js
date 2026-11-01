jest.mock("../../src/services/storage.client", () => ({
  getCount: jest.fn(),
  incrementCount: jest.fn(),
}));

const request = require("supertest");
const app = require("../../src/app");
const storageClient = require("../../src/services/storage.client");

describe("Counter Service - API Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("GET /api/count", () => {
    it("returns count successfully", async () => {
      storageClient.getCount.mockResolvedValue(7);

      const res = await request(app).get("/api/count");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 7 });
    });

    it("returns 502 when storage service is unreachable", async () => {
      storageClient.getCount.mockRejectedValue(new Error("ECONNREFUSED"));

      const res = await request(app).get("/api/count");

      expect(res.status).toBe(502);
    });
  });

  describe("POST /api/increment", () => {
    it("returns incremented count successfully", async () => {
      storageClient.incrementCount.mockResolvedValue(8);

      const res = await request(app).post("/api/increment");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 8 });
    });

    it("returns 502 when storage service is unreachable", async () => {
      storageClient.incrementCount.mockRejectedValue(new Error("ECONNREFUSED"));

      const res = await request(app).post("/api/increment");

      expect(res.status).toBe(502);
    });
  });

  describe("GET /health", () => {
    it("returns service health status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok", service: "counter-service" });
    });
  });
});
