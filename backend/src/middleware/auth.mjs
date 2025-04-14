import { HttpStatusCode } from "axios";

function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: "Unauthorized" });
  }
  if (token !== "test") {
    return res.status(HttpStatusCode.Forbidden).json({ message: "Forbidden" });
  }

  next();
}

export { auth };
