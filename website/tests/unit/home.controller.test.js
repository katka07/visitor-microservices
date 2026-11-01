const os = require("os");

jest.mock("../../src/services/counter.client", () => ({
  incrementAndGetCount: jest.fn(),
}));

const counterClient = require("../../src/services/counter.client");
const homeController = require("../../src/controllers/home.controller");

describe("Home Controller - Website (Unit)", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = { render: jest.fn() };
    jest.clearAllMocks();
  });

  it("renders index with count on success", async () => {
    counterClient.incrementAndGetCount.mockResolvedValue(42);

    await homeController.renderHome(req, res);

    expect(res.render).toHaveBeenCalledWith("index", {
      count: 42,
      error: null,
      hostname: os.hostname(),
    });
  });

  it("renders index with error message when counter service fails", async () => {
    counterClient.incrementAndGetCount.mockRejectedValue(
      new Error("Service down"),
    );

    await homeController.renderHome(req, res);

    expect(res.render).toHaveBeenCalledWith("index", {
      count: null,
      error: "Unable to fetch visitor count right now.",
      hostname: os.hostname(),
    });
  });
});
