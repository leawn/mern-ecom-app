const User = require('../models/User');

exports.corupUser = (req, res, next) => {
    const { name, picture, email } = req.user;

    User
        .findOneAndUpdate(
            {
                email
            },
            {
                name: email.split('@')[0],
                picture
            },
            {
                new: true
            }
            )
        .then(user => {
            if (!user) {
                return new User({
                    email,
                    name: email.split('@')[0],
                    picture
                }).save();
            }
        })
        .then((user) => {
            return res.json(user);
        })
        .catch(err => {
            console.log(err);
        });
}

exports.currentUser = (req, res, next) => {
    User
        .findOne({ email: req.user.email })
        .exec((err, user) => {
            if (err) {
                console.log(err);
            }
            res.json(user);
        })
}