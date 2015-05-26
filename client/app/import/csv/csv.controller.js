'use strict';

angular.module('appManagerApp')
.controller('CsvCtrl', function ($scope, $rootScope, Settings) {
    $scope.init = function(){
        $scope.settings = Settings;
        $scope.map = {};
    }

    $scope.reset = function(){
        $scope.init();
        $scope.jcsv = false;
        $scope.headers = false;
        $('form.file-input').each(function(i, element){
            element.reset();
        });
    }

    $scope.importCSV = function(rawCSV){
        console.log(rawCSV);
        $scope.jcsv =  $.csv.toArrays(rawCSV);
        $scope.headers = $scope.grabHeaders($scope.jcsv.shift());
        $scope.$apply();
    }

    $scope.grabHeaders = function(headArray){
        for (var i in headArray) {
            headArray[i] = {
                name: headArray[i],
                language: false,
                key: false,
                index: i
            }
        }
        return headArray;
    }

    $scope.addFile = function (element) {
        $scope.getFile(element.files[0], $scope.importCSV)
    }

    $scope.getFile = function (file, cb) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function (event) {
            var result = event.target.result;
            cb(result);
        }
    }

    $scope.getOptions = function(args){
        var options = [];
        if (!args) {
            return options;
        }
        args.forEach(function(val, i){
            options.push({
                text: val.name,
                value: val.key
            });
        });
        return options;
    }

    $scope.saveImport = function(jcsv, headers){
        var importCollection = new DataCollection('string');
        for (var i in jcsv) {
            var row = jcsv[i]
            var string = new DataObject('string');
            for (var j in headers) {
                var header = headers[j];
                if (header.language) {
                    string[header.language] = row[header.index];
                }
                if (header.key) {
                    string[header.key] = row[header.index];
                }
            }
            importCollection.push(string);
            string.save();
        }
        window.importCollection = importCollection;
    }

    $scope.init();
    window.s = $scope;
});
