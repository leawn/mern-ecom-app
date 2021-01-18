const User = require('../models/User');

exports.corupUser = (req, res, next) => {
    const { name, picture, email } = req.user;

    User
        .findOneAndUpdate({ email }, { name, picture }, { new: true })
        .then(user => {
            if (!user) {
                return new User({
                    email,
                    name,
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