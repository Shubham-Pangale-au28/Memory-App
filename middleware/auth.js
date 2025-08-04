const jwt = require("jsonwebtoken");
const logger = require("../config/logger/logger.config");

const secret = process.env.ACCESS_TOCKEN_SECRET || "test";

const auth = async (req, res, next) => {
  logger.info("AuthMiddleware ---> auth ---> Reached");
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    logger.info("AuthMiddleware ---> auth ---> End");
    next();
  } catch (error) {
    logger.error("AuthMiddleware ---> auth ---> Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = auth;
