jest.mock("../../src/services/counter.client", () => ({
  incrementAndGetCount: jest.fn(),
}));

const request = require("supertest");
const app = require("../../src/app");
const counterClient = require("../../src/services/counter.client");

describe("Website - Route Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("GET /", () => {
    it("renders the homepage with visitor count", async () => {
      counterClient.incrementAndGetCount.mockResolvedValue(10);

      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.text).toContain("10");
      expect(res.text).toContain("Welcome");
    });

    it("renders error message when counter service is down", async () => {
      counterClient.incrementAndGetCount.mockRejectedValue(new Error("down"));

      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.text).toContain("Unable to fetch visitor count");
    });
  });

  describe("GET /health", () => {
    it("returns service health status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok", service: "website" });
    });
  });
});
