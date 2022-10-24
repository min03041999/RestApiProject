const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("x-access-token");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  //   const token = authHeader.split(" ")[1];
  const token = authHeader;
  //   console.log("TOKEN: ", token);
  //   console.log("JSON: " + JSON.parse(token));

  let decodedToken;
  try {
    decodedToken = jwt.verify(JSON.parse(token), "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
