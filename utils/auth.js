const User = require('../schemas/User.schema');

let auth = (req, res, next) => {
    let token = req.cookies.token;
    console.log(token)
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({
            error: true
        });

        req.token = token;
        req.user = user;
        next();
    });
}

module.exports = { auth };