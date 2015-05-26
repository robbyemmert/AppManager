'use strict';

angular.module('appManagerApp')
.controller('StringsCtrl', function ($scope, $filter, $http, DataCollection, DataObject, Settings) {
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
        str.save();
    }

    $scope.deleteString = function(str){
        str.delete();
        var index = $scope.strings.indexOf(str);
        $scope.strings.splice(index, 1);
    }

    $scope.init();
});
