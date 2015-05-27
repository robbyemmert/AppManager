'use strict';

angular.module('appManagerApp')
.controller('StringsCtrl', function ($scope, $rootScope, $filter, $http, DataCollection, DataObject, Settings, EVENTS) {
    $scope.init = function(){
        $scope.settings = Settings;

        $scope.strings = new DataCollection('string');
        $scope.strings.query();
        window.s = $scope;
    }

    $scope.appendString = function(){
        var newString = new DataObject('string');
        $scope.strings.push(newString);
    }

    $scope.prependString = function(){
        var newString = new DataObject('string');
        $scope.strings.unshift(newString);
    }

    $scope.saveString = function(str){
        str.save(function(data, status){
            if (data && status >= 200 && status < 300) {
                $rootScope.$emit(EVENTS.stringSaveSucceeded);
            } else {
                $rootScope.$emit(EVENTS.stringSaveFailed);
            }
        });
    }

    $scope.deleteString = function(str){
        str.delete(function(data, status){
            console.log("Status: ", status);
            if (status >= 200 && status < 300) {
                $rootScope.$emit(EVENTS.stringDeleteSucceeded);
            } else {
                $rootScope.$emit(EVENTS.stringDeleteFailed);
            }
        });
        var index = $scope.strings.indexOf(str);
        $scope.strings.splice(index, 1);
    }

    $scope.init();
});
