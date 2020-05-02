const mongoose = require('mongoose');
const EventSchema = require('./EventSchema');

module.exports = mongoose.model('Event', EventSchema);
