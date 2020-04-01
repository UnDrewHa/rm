const mongoose = require('mongoose');
const EventSchema = require('./schemas/EventSchema');

module.exports = mongoose.model('Event', EventSchema);
