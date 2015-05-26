/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var String = require('./string.model');

exports.register = function(socket) {
  String.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  String.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('string:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('string:remove', doc);
}