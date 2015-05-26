'use strict';

angular.module('appManagerApp')
.controller('ExportStringsCtrl', function ($scope, IOSString, IOSStringFile, $stateParams, DataCollection, DataObject, Settings) {
    $scope.init = function () {
        $scope.strings = $stateParams.strings;
        if (!$scope.strings) {
            $scope.strings = new DataCollection('string');
            $scope.strings.query();
        }

        $scope.settings = Settings;
        $scope.localizables = $scope.initLocalizables(Settings.languages);
        $scope.storyboards = {};
        $scope.step = "Localizable";

        $scope.localizablePreviewLanguage = Settings.languages[0]
        $scope.storyboardPreviewLanguage = Settings.languages[0]
        $scope.iosKey = Settings.getKeyByKey('ios');
        //
        // $scope.initLocalizables(Settings.languages);
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
        for (var i in $scope.strings) {
            var string = $scope.strings[i];
            var iosString = new IOSString(string[$scope.iosKey], string[language.key]);
            if (!iosString.value) {
                console.warn("No " + language.name + " translation for key " + string[$scope.iosKey]);
            }
            localizable.add(iosString);
        }
        return localizable;
    }

    $scope.init();
});
