// Replace real ioredis with in-memory mock for integration tests
jest.mock("ioredis", () => require("ioredis-mock"));

const request = require("supertest");
const app = require("../../src/app");
const redisClient = require("../../src/config/redis");

describe("Storage Service - API Integration", () => {
  beforeEach(async () => {
    await redisClient.flushall(); // reset counter before each test
  });

  describe("GET /api/count", () => {
    it("returns 0 when no visits have happened yet", async () => {
      const res = await request(app).get("/api/count");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 0 });
    });
  });

  describe("POST /api/increment", () => {
    it("increments count starting from 1", async () => {
      const res = await request(app).post("/api/increment");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 1 });
    });

    it("increments count correctly across multiple calls", async () => {
      await request(app).post("/api/increment");
      await request(app).post("/api/increment");
      const res = await request(app).post("/api/increment");

      expect(res.body).toEqual({ count: 3 });
    });
  });

  describe("GET /api/count after increments", () => {
    it("reflects the current count correctly", async () => {
      await request(app).post("/api/increment");
      await request(app).post("/api/increment");

      const res = await request(app).get("/api/count");

      expect(res.body).toEqual({ count: 2 });
    });
  });

  describe("GET /health", () => {
    it("returns service health status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok", service: "storage-service" });
    });
  });

  describe("Unknown routes", () => {
    it("returns 404 for undefined routes", async () => {
      const res = await request(app).get("/this-does-not-exist");

      expect(res.status).toBe(404);
    });
  });
});
