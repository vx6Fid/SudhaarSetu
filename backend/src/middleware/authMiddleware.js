const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET  = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err) {
        res.status(401).json({ error: "Invalid Token" });
    }
};
