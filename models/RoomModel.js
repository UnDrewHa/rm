const mongoose = require('mongoose');
const RoomSchema = require('./schemas/RoomSchema');

module.exports = mongoose.model('Room', RoomSchema);
