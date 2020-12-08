const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        token = token.split(' ');
        token = token[1];
        // console.log("token", token[1]);

        const jwtVerify = jwt.verify(token, "mini_social_networking_project_in_angular");
        // console.log("Jwt verify ", jwtVerify);
        req.userData = {email: jwtVerify.email, userId: jwtVerify.userId}
        next();
    } catch {
        res.status(401).json({ message: "Auth failed" })
    }
}