'use strict';

angular.module('appManagerApp')
.controller('AndroidExportStringsCtrl', function ($scope, $stateParams, Settings, AndroidString, AndroidStringFile) {
    $scope.init = function (strings) {
        $scope.strings = strings;
        if (!$scope.strings) {
            $scope.strings = new DataCollection('string');
            $scope.strings.query(null, $scope.queryCallback);
            return;
        }
        $scope.generationPreviewLanguage = Settings.languages[0]
        $scope.storyboardPreviewLanguage = Settings.languages[0]
        $scope.androidKey = Settings.getKeyByKey('android');

        $scope.settings = Settings;
        $scope.showPreview = true;
        $scope.step = "Generate";
        window.s = $scope;

        $scope.localizables = $scope.initLocalizables(Settings.languages, $scope.strings);
    }

    $scope.queryCallback = function(){
        $scope.init($scope.strings);
    }

    $scope.initLocalizables = function(languages, strings){
        var localizables = {};
        languages.forEach(function(language, i){
            localizables[language.key] = $scope.initLocalizable(language, strings);
        });
        return localizables;
    }

    $scope.initLocalizable = function(language, strings){
        if (!language) {
            language = $scope.generationPreviewLanguage;
        }
        var localizable = new AndroidStringFile("strings.xml");
        var folderKey = language.androidKey || language.key || "Unknown Language";
        localizable.folderName = "values-" + folderKey;
        localizable.language = language;
        $scope.strings.forEach(function(string, i){
            if(!string[$scope.androidKey.key]){
                return;
            }
            var androidString = new AndroidString(string[$scope.androidKey.key], string[language.key]);
            if (!androidString.value) {
                console.warn("No " + language.name + " translation for key " + string[$scope.androidKey.key]);
            } else {
                localizable.add(androidString);
            }
        });
        return localizable;
    }

    $scope.saveLocalizables = function(localizables){
        var zip = new JSZip();
        for (var key in localizables) {
            if (localizables.hasOwnProperty(key)) {
                var localizable = localizables[key];
                var folderName = localizable.folderName || localizable.language.name || "Untitled Language";
                var fileName = localizable.fileName || "strings.xml";
                var languageFolder = zip.folder(folderName);
                languageFolder.file(fileName, localizable.toString());
            }
        }

        var zipFile = zip.generate({
            type: "blob"
        });

        saveAs(zipFile, "Generated Android Strings.zip");
    }

    $scope.init($stateParams.strings);
});
