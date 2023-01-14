const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  /*
  1. Check for authentication token
  2. If token not found, return a un_auth token
  3. if found countinue to next function
  
  */
  console.log(token);
  if (!token) {
    return res.status(401).send("Unauthenticated");
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(user);
    req.user = user;
  } catch (error) {
    res.status(403).send("Invalid Token");
  }
  next();
};
