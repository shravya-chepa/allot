const jwt = require("jsonwebtoken");
const JWT_SECRET =  process.env.JWT_SECRET || "6b66f6d5-d103-4cc0-8578-a6c37ab4bda5";
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS512";
const JWT_ARGS = [JWT_SECRET, { algorithm: JWT_ALGORITHM }];

module.exports = {
    JWT_SECRET,
    JWT_ARGS,

    generateJWT(user) {
        return jwt.sign({ user, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, ...JWT_ARGS); // 1 hour authetication
    },
    verifyJWT(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch(error) {
            throw error
        }
    }
};