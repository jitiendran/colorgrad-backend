const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = (req) => {
    const header = req.headers.authorization;
    if (!header) {
        throw new Error("Invalid Authentication");
    }
    const token = header.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        return decoded;
    } catch {
        throw new Error("Invalid Access Token");
    }
};
