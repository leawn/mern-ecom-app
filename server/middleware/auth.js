const admin = require('../firebase');

exports.authCheck = (req, res, next) => {
    console.log(req.headers); //token

    admin
        .auth()
        .verifyIdToken(req.headers.authtoken)
        .then((user) => {
            req.user = user;
            return next();
        })
        .catch(err => {
            res.status(401).json({
                err: 'Invalid or expired token.'
            });
        });
}