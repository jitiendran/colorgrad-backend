const jwt = require("jsonwebtoken");

module.exports = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "10m" });
};
