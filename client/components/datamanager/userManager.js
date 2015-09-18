angular.module('DataManager')
.factory('DataUser', function($http, Utils){
    var base = function(id){
        this.target = Utils.Url(Config.baseDomain + "/api/users");
        this.id = id;

        this.load = function(cb, fcb){
            var scope = this;
            if (typeof cb != "function") {
                cb = function() {};
            }
            if (typeof fcb != "function") {
                fcb = function() {};
            }
            var url;
            if (!!scope.id) {
                url = scope.target + "/" + scope.id;
            } else {
                url = scope.target + "/me";
            }

            var promise = $http.get(url);
            promise.success(function(data, status, headers, config) {
                scope.__proto__._id = data._id;
                data = traverseSchema(data, data.schema, schemaTypeFilter);

                Utils.resetObject(scope, data);
                console.log("Successfully loaded " + scope.typeName + " #" + scope._id);

                cb(data, status, headers, config);
            })

            promise.error(fcb);
        }
    }
})
