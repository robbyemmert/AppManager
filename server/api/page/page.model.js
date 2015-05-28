'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// var PageTranslationSchema = new Schema({
//     title: String,
//     content: String,
//     languageKey: String
// })
//
// var PageSchema = new Schema({
//     name: String,
//     fileName: String,
//     translations: [
//         PageTranslationSchema
//     ]
// });

var PageSchema = new Schema({}, { strict: false, id: false }); 

module.exports = mongoose.model('Page', PageSchema);
