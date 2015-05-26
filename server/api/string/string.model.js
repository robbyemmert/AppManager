'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StringSchema = new Schema({}, { strict: false, id: false });  // Mixed schema type - no validation.  Must manually mark changes.

module.exports = mongoose.model('String', StringSchema);
