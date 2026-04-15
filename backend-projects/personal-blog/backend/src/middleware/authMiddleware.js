import "dotenv/config";
import { authDecoder } from "../utils/authDecoder.js";

export const authMiddleware = (req, res, next) => {
  const { username, password } = authDecoder(req.headers.authorization || "");

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  )
    return next();

  res.set("WWW-Authenticate", 'Basic realm="user_pages"');
  res.status(401).send("Authentication required.");
};
