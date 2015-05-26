'use strict';

angular.module('appManagerApp')
.controller('ExportStringsCtrl', function ($scope, IOSString, IOSStringFile, $stateParams, DataCollection, DataObject, Settings) {
    $scope.init = function (strings) {
        $scope.strings = strings;
        if (!$scope.strings) {
            $scope.strings = new DataCollection('string');
            $scope.strings.query(null, $scope.queryCallback);
            return;
        }

        $scope.settings = Settings;
        $scope.step = "Localizable";
        $scope.showPreview = true;

        $scope.localizablePreviewLanguage = Settings.languages[0]
        $scope.storyboardPreviewLanguage = Settings.languages[0]
        $scope.iosKey = Settings.getKeyByKey('ios');

        $scope.localizables = $scope.initLocalizables(Settings.languages);
        $scope.storyboards = {};
        window.s = $scope;
    }

    $scope.queryCallback = function(){
        $scope.init($scope.strings);
    }

    $scope.saveLocalizables = function(localizables){
        var zip = new JSZip();
        for (var key in localizables) {
            if (localizables.hasOwnProperty(key)) {
                var localizable = localizables[key];
                var folderName = localizable.folderName || localizable.language.name || "Untitled Language";
                var fileName = localizable.fileName || "Localizable.strings";
                var languageFolder = zip.folder(folderName);
                languageFolder.file(fileName, localizable.toString());
            }
        }

        var zipFile = zip.generate({
            type: "blob"
        });

        saveAs(zipFile, "iOS Localizables.zip");
    }

    $scope.saveFile = function(string, fileName){
        var blob = new Blob([string], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, fileName);
    }

    $scope.initLocalizables = function(languages){
        var localizables = {};
        languages.forEach(function(language, i){
            localizables[language.key] = $scope.initLocalizable(language);
        });
        console.log(localizables);
        return localizables;
    }

    $scope.initLocalizable = function (language) {
        if (!language) {
            language = $scope.localizablePreviewLanguage;
        }
        var localizable = new IOSStringFile("Localizable.strings");
        localizable.folderName = language.key + ".lproj";
        localizable.language = language;
        $scope.strings.forEach(function(string, i){
            var iosString = new IOSString(string[$scope.iosKey.key], string[language.key]);
            if (!iosString.value) {
                console.warn("No " + language.name + " translation for key " + string[$scope.iosKey]);
            }
            localizable.add(iosString);
        })
        return localizable;
    }

    $scope.init($stateParams.strings);
});
