import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, Signin to continue" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized, Signin to continue" });
    }
    req.user = user;
    next();
  });
};
