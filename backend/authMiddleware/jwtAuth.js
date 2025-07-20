const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log("bearerHeader read: ", bearerHeader);
  const token = bearerHeader.split(" ")[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    console.log("just to confirm: ", req.user);
    next();
  });
}

module.exports = verifyToken;
