'use strict';

var express = require('express');
var controller = require('./string.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole(['admin', 'developer']), controller.create);
router.put('/:id', auth.hasRole(['admin', 'developer']), controller.update);
router.put('/:id/:language', auth.hasLanguageAccess(), controller.updateTranslation);
router.patch('/:id', auth.hasRole(['admin', 'developer']), controller.update);
router.delete('/:id', auth.hasRole(['admin', 'developer']), controller.destroy);

module.exports = router;
