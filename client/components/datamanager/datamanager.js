/*
DataManager.js
By: Robby Emmert
Version 0.0.1
License: MIT
*/
angular.module('DataManager', [])
.factory('Config', function(){
    return {
        baseDomain: window.location.origin
    }
})

.factory('Utils', function() {
    var Utils = {
        resetObject: function(obj, resetObj) {
            for (var val in obj) {
                delete obj[val];
            }
            if (!!resetObj) {
                for (var val in resetObj) {
                    obj[val] = resetObj[val];
                }
            }
        },
        Url: function(url){
            url = url || window.location.href;
            var parser = document.createElement('a');
            parser.href = url;
            parser.appendPath = function(subPath){
                if(parser.pathname.slice(-1) != '/')
                    parser.pathname += '/';

                parser.pathname += subPath;
            }
            return parser;
        },
        getSchemaType: function(type){
            if(typeof type === 'object' && !Array.isArray(type)){
                if(typeof type.type === 'string'){
                    return type.type;
                } else {
                    return 'Object';
                }
            } else if(Array.isArray(type)) {
                return 'Array';
            } else if(typeof type === 'string'){
                return type;
            }
        },
        capFirstLetter: function(str){
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }

    return Utils;
})

.factory('DataObject', function($http, Utils, Config) {
    var base = function(typeName, id) {
        if (!typeName) {
            console.error("Can't create a DataObject with no typeName!");
            return undefined;
        }

        var traverseSchema = function(data, schema, cb){
            for(var key in schema){
                var svalue = schema[key];
                if(typeof svalue === 'object' && !!data[key]){
                    data[key] = traverseSchema(data[key], schema[key], cb);
                } else if(typeof svalue === 'string'){
                    data[key] = cb(data[key], svalue);
                }
                console.log("Type of " + key + ": ", svalue);
            }

            return data;
        }

        var schemaTypeFilter = function(value, schemaType) {
            if(schemaType === 'Date'){
                return new Date(value);
            } else {
                return value;
            }
        }

        this.typeName = typeName;
        this._id = id;
        this.target = Utils.Url(Config.baseDomain + "/api/" + typeName + "s/");

        this.save = function(cb, fcb) {
            var promise;

            var scope = this;
            if (typeof cb != "function") {
                cb = function() {};
            }
            if (typeof fcb != "function") {
                fcb = function() {};
            }

            if (!scope._id) {
                promise = $http.post(scope.target, scope);
            } else {
                promise = $http.put(scope.target + scope._id, scope);
            }

            promise.success(function(data, status, headers, config) {
                scope.__proto__._id = data._id;
                scope.__proto__._schema = data.schema;
                Utils.resetObject(scope, data);
                console.log("Successfully saved " + scope.typeName + " #" + scope._id);
                cb(data, status, headers, config);
            })

            promise.error(fcb);

            return promise;
        }

        this.load = function(cb, fcb) {
            if (typeof cb != "function") {
                cb = function() {};
            }
            if (typeof fcb != "function") {
                fcb = function() {};
            }
            if (!this._id) {
                console.error("Can't load object with no _id!");
                return;
            }
            var scope = this;
            var promise = $http.get(scope.target + scope._id);

            promise.success(function(data, status, headers, config) {
                scope.__proto__._id = data._id;
                scope.__proto__._schema = data.schema;
                data = traverseSchema(data, data.schema, schemaTypeFilter);

                Utils.resetObject(scope, data);
                console.log("Successfully loaded " + scope.typeName + " #" + scope._id);

                cb(data, status, headers, config);
            })

            promise.error(fcb);

            return promise;
        }

        this.delete = function(cb, fcb) {
            if(typeof cb != "function")
                cb = function(){};
            if(typeof fcb != "function")
                fcb = function(){};

            var scope = this;
            if (!scope._id) {
                console.error("Can't delete object with no _id!");
                return;
            }

            var promise = $http.delete(scope.target + scope._id);
            promise.success(function(data, status, headers, config) {
                console.log("Successfully deleted " + scope.typeName + " #" + scope._id);
                cb(data, status, headers, config);
            });
            promise.error(fcb)

            return promise;
        }

        this.copy = function(jsonObject) {
            // console.log("jsonObject", jsonObject);
            var scope = this;
            if (!scope.typeName) {
                scope.typeName = jsonObject.typeName;
            }

            if (!scope.typeName) {
                console.error('Can\'t create a DataObject from an object without a valid typeName!');
                return undefined;
            }

            scope.__proto__._id = jsonObject._id;
            Utils.resetObject(scope, jsonObject);
        }

        var returnObject = {};
        returnObject.__proto__ = this;
        return returnObject;
    }

    return base;
})

.factory('DataCollection', function($http, DataObject, Config, Utils) {
    var base = function(typeName) {
        this.typeName = typeName;

        this.query = function(selector, cb) {
            if(typeof cb != "function")
                cb = function(){};

            //Prepare the mongoDB selector
            if(selector instanceof Object){
                selector.toJSON = function() {
                    var returnObject = {};
                    for(var key in selector){
                        if(selector[key] instanceof RegExp){
                            returnObject[key] = "$RegExp:" + selector[key].toString();
                        } else {
                            returnObject[key] = selector[key];
                        }
                    }
                    return returnObject;
                }
            }

            //Param parsing must manipulate the URL
            var url = Utils.Url(Config.baseDomain + "/api/" + typeName + "s/");

            if (selector instanceof Object)
                url += "?q=" + JSON.stringify(selector);

            var scope = this;
            var promise = $http.get(url);
            promise.success(function(data, status, headers, config) {
                console.log("Success!", data);
                scope.splice(0, scope.length);
                console.log(scope.typeName);
                for (var index in data) {
                    var da = new DataObject(scope.typeName);
                    // console.log(da);
                    if(da.__proto__._schema != data.schema){
                        da.__proto__._schema = data.schema;
                    }
                    da.copy(data[index]);
                    scope.push(da);
                }

                cb(data, status, headers, config);
            });

            return promise;
        }
    }
    base.prototype = Array.prototype;

    return base;
})

.run(function(DataObject, DataCollection, Utils){
    //Send DataObject to window for console debugging
    window.DataObject = DataObject;
    window.DataCollection = DataCollection;
    window.Utils = Utils
})
