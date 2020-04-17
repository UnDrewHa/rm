const {USER_ROLE, ADMIN_ROLE} = require('./roles');

module.exports = {
    [USER_ROLE]: [
        'users:updateMe',
        'users:changePassword',
        'users:deleteMe',

        'rooms:getAll',
        'rooms:getById',

        'events:create',
        'events:update',
        'events:getAll',
        'events:getById',

        'buildings:getAll',
        'buildings:getById',
    ],
    [ADMIN_ROLE]: [
        'users:getAll',
        'users:getById',
        'users:create',
        'users:update',
        'users:delete',

        'rooms:create',
        'rooms:update',
        'rooms:delete',
        'rooms:getAll',
        'rooms:getById',

        'events:create',
        'events:update',
        'events:delete',
        'events:getAll',
        'events:getById',

        'buildings:getAll',
        'buildings:getById',
        'buildings:create',
        'buildings:update',
        'buildings:delete',
    ],
};
