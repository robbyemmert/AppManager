'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
* Attaches the user object to the request if authenticated
* Otherwise returns 403
*/
function isAuthenticated() {
    return compose()
    // Validate jwt
    .use(function(req, res, next) {
        // allow access_token to be passed through query parameter as well
        if(req.query && req.query.hasOwnProperty('access_token')) {
            req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
        User.findById(req.user._id, function (err, user) {
            if (err) return next(err);
            if (!user) return res.send(401);

            req.user = user;
            next();
        });
    });
}

/**
* Checks if the user role meets the minimum requirements of the route
*/
function hasRole(allowedRoles) {
    if (!allowedRoles) throw new Error('Required role needs to be set');
    if (typeof allowedRoles === "string") {
        allowedRoles = [allowedRoles];
    } else if (!Array.isArray(allowedRoles)) {
        console.error("Unrecognized type for allowedRoles.  Must be a string or Array");
        res.send(500, "Authorization Server Error");
    }

    return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
        //   if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(allowedRoles)) {
        //     next();
        //   }
        if (allowedRoles.indexOf(req.user.role) > -1) {
            next();
        } else {
            res.send(403);
        }
    });
}

/**
*  Checks if user has access to language
*/
function hasLanguageAccess(language){
    return compose()
    .use(isAuthenticated())
    .use(function(req, res, next){
        if(!req.user){
            res.send(401, "No user attached to request.");
            console.error("No user attached to request.");
        }
        var languages = req.user.languages;
        if (languages.indexOf('*') > -1 || languages.indexOf(req.params.language) > -1) {
            console.log("Language allowed");
            next()
        } else {
            console.error("You do not have permission to edit that language");
            res.json(403, {
                status: 403,
                message: "You do not have permission to edit that language"
            });
        }
    })
}

/**
* Returns a jwt token signed by the app secret
*/
function signToken(id) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}

/**
* Set token cookie directly for oAuth strategies
*/
function setTokenCookie(req, res) {
    if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', JSON.stringify(token));
    res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasLanguageAccess = hasLanguageAccess;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
