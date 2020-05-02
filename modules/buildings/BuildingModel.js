const mongoose = require('mongoose');
const BuildingSchema = require('./BuildingSchema');

module.exports = mongoose.model('Building', BuildingSchema);
