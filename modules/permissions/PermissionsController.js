const RBACRules = require('./rules');

exports.get = function (req, res, next) {
    const {user} = res.locals;

    res.status(200).json({
        data: RBACRules[user.role],
    });
};
