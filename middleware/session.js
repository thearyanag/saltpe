const session = require('express-session');

/**
 * Session middleware
 */
let sesh = session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : false,
    cookie : { secure : true }
});

module.exports = sesh;