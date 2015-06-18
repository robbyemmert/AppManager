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
    'angular.filter',
    'angular-growl',
    'textAngular'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
    .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
})

.run(function($rootScope, EVENTS, growl){
    $rootScope.$on(EVENTS.stringSaveSucceeded, function(){
        growl.addSuccessMessage("String saved.");
    });

    $rootScope.$on(EVENTS.stringSaveFailed, function(){
        growl.addErrorMessage("String failed to save! Please check your connection and try again.");
    });

    $rootScope.$on(EVENTS.stringDeleteSucceeded, function(){
        growl.addSuccessMessage("String deleted.");
    });

    $rootScope.$on(EVENTS.stringDeleteFailed, function(){
        growl.addErrorMessage("String failed to delete! Please check your connection and try again.");
    });

    $rootScope.$on(EVENTS.csvImportSucceeded, function(){
        growl.addSuccessMessage("CSV successfully imported");
    });

    $rootScope.$on(EVENTS.csvImportFailed, function(){
        growl.addErrorMessage("CSV failed to import! Please check your connection and CSV file and try again.");
    });
})

.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
}])

.constant('EVENTS', {
    csvImportSucceeded: "csv-import-success",
    csvImportFailed: "csv-import-fail",
    stringSaveSucceeded: "string-save-success",
    stringSaveFailed: "string-save-fail",
    stringDeleteSucceeded: "string-delete-success",
    stringDeleteFailed: "string-delete-fail"
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

.factory('AndroidString', function(){
    return function(key, value){
        this.key = key;
        this.value = value;

        this.toString = function(){
            return '<string name="' + this.key + '">' + this.value + '</string>';
        }

        this.xml = function(){
            var parser = new DOMParser();
            return $(parser.parseFromString(this.toString()));
        }
    }
})

.factory('AndroidStringFile', function(){
    return function(fileName) {
        this.docHead = '<?xml version="1.0" encoding="utf-8"?>';
        this.rootElement = 'resources';
        this.stringList = [];
        this.fileName = fileName;

        this.add = function(androidString){
            this.stringList.push(androidString);
        }
        this.toString = function(){
            var output = this.docHead;
            output += '<' + this.rootElement + '>\n';
            this.stringList.forEach(function(string, i){
                output += '\t' + string.toString() + '\n';
            });
            output += '</' + this.rootElement + '>';

            return output;
        }
        this.save = function(fileName){
            fileName = fileName || this.fileName;
            var blob = new Blob([this.toString()], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, fileName);
        }
    }
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
})
.factory('IOSStringFile', function () {
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
        this.save = function(fileName){
            fileName = fileName || this.fileName;
            var blob = new Blob([this.toString()], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, fileName);
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
