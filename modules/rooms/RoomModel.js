const mongoose = require('mongoose');
const RoomSchema = require('./RoomSchema');

module.exports = mongoose.model('Room', RoomSchema);
