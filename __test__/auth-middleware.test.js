const { isAuth } = require("../middleware/is-auth");

describe("is-auth middleware", () => {
  test("should throw an error if no authorization header is present", async () => {
    const req = {
      get: function () {
        return null;
      },
    };
    const res = {};
    const next = jest.fn();

    await isAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(next.mock.calls[0][0].message).toBe("Not authenticated.");
  });
});
