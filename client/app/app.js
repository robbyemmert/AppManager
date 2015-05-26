'use strict';

angular.module('appManagerApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'DataManager',
    'xeditable',
    'angular.filter'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
    .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
})

.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
        // Add authorization token to headers
        request: function (config) {
            config.headers = config.headers || {};
            if ($cookieStore.get('token')) {
                config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
            }
            return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function(response) {
            if(response.status === 401) {
                $location.path('/login');
                // remove any stale tokens
                $cookieStore.remove('token');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }
    };
})

.factory('IOSString', function () {
    var addslashes = function(str) {
        return str.replace(/[\\'"]/g, '\\$&').replace(/\u000/g, '\\0');
    }
    return function (key, value, comment) {
        this.key = key;
        this.value = value;
        this.comment = comment;

        this.formattedComment = function(){
            if(!this.comment){
                return "";
            }
            return "/* " + addslashes(this.comment) + " */\n";
        };
        this.toString = function(){
            return this.formattedComment() + '"' + addslashes(this.key) + '" = "' + addslashes(this.value) + '";\n';
        };
    }
}).factory('IOSStringFile', function () {
    return function (fileName) {
        this.stringList = [];
        this.fileName = fileName;
        this.add = function(iosString){
            this.stringList.push(iosString);
        }
        this.toString = function(){
            var fileString = ""
            this.stringList.forEach(function(string, i){
                if(!string.key || !string.value){
                    console.warn("Empty string at " + i + ". " + string.toString());
                    return;
                }
                fileString += string.toString();
            })
            return fileString;
        }
    }
})

.run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
        Auth.isLoggedInAsync(function(loggedIn) {
            if (next.authenticate && !loggedIn) {
                $location.path('/login');
            }
        });
    });
})

.run( [ '$rootScope', function ($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.$previousState = from;
    });
}]);
