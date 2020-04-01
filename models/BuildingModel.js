const mongoose = require('mongoose');
const BuildingSchema = require('./schemas/BuildingSchema');

module.exports = mongoose.model('Building', BuildingSchema);
