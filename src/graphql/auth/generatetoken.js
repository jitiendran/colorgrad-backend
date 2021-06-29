const jwt = require("jsonwebtoken");

module.exports = (user, token) => {
    return jwt.sign(user, token, { expiresIn: "15m" });
};
