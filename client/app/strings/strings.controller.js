'use strict';

angular.module('appManagerApp')
.controller('StringsCtrl', function ($scope, $rootScope, $filter, $http, DataCollection, DataObject, Settings, EVENTS, growl) {
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
        }, function(data, status){
            if (status == 403) {
                growl.addErrorMessage("You don't have permission to do that!");
            } else {
                growl.addErrorMessage("There was an error saving! Please check your connection and try again");
            }
            str.load();
        });
    }

    $scope.deleteString = function(str){
        var promise = str.delete(function(data, status){
            console.log("Status: ", status);
            $rootScope.$emit(EVENTS.stringDeleteSucceeded);

            var index = $scope.strings.indexOf(str);
            $scope.strings.splice(index, 1);
        });

        promise.error(function(data, status){
            if (status == 403) {
                growl.addErrorMessage("You don't have permission to do that!");
            } else {
                growl.addErrorMessage("String failed to delete! Please check your connection and try again.");
            }
        });
    }

    $scope.init();
});
