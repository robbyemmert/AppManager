'use strict';

var _ = require('lodash');
var String = require('./string.model');

// Get list of strings
exports.index = function(req, res) {
    String.find(function (err, strings) {
        if(err) { return handleError(res, err); }
        return res.json(200, strings);
    });
};

// Get a single string
exports.show = function(req, res) {
    String.findById(req.params.id, function (err, string) {
        if(err) { return handleError(res, err); }
        if(!string) { return res.send(404); }
        return res.json(string);
    });
};

// Creates a new string in the DB.
exports.create = function(req, res) {
    String.create(req.body, function(err, string) {
        if(err) { return handleError(res, err); }
        return res.json(201, string);
    });
};

// Updates an existing string in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    String.findByIdAndUpdate(req.params.id, req.body, function(err, updatedString){
        if(err){ return handleError(res, err); }
        return res.json(200, updatedString);
    });
};

exports.updateTranslation = function(req, res){
    // if(req.body._id) { delete req.body._id; }
    //
    var update = {};
    update[req.params.language] = req.body.translation;
    console.log("Body: ", req.body);
    console.log("Update: ", update);
    String.findByIdAndUpdate(req.params.id, {$set: update}, function(err, updatedString){
        if(err){ return handleError(res, err); }
        return res.json(200, updatedString);
    });
}

// Deletes a string from the DB.
exports.destroy = function(req, res) {
    String.findById(req.params.id, function (err, string) {
        if(err) { return handleError(res, err); }
        if(!string) { return res.send(404); }
        string.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
