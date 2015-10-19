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

        $scope.localizablePreviewLanguage = Settings.languages[0];
        $scope.storyboardPreviewLanguage = Settings.languages[0];
        $scope.storyboardLanguage = Settings.languages[0];
        $scope.iosKey = Settings.getKeyByKey('ios');

        $scope.localizables = $scope.initLocalizables(Settings.languages);
        $scope.storyboards = false;
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

    $scope.saveStoryboards = function(storyboards){
        var zip = new JSZip();
        for (var lang in storyboards) {
            if (storyboards.hasOwnProperty(lang)) {
                var storyboard = storyboards[lang];
                storyboard = $scope.stripBlankTranslations(storyboard);
                
                var folderName = storyboard.folderName;
                var fileName = storyboard.fileName;

                var languageFolder = zip.folder(folderName);
                languageFolder.file(fileName, storyboard.toString());
            }
        }

        var zipFile = zip.generate({
            type: "blob"
        });

        saveAs(zipFile, "iOS Storyboards.zip");
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

    $scope.initStoryboards = function(languages, rawFile, fileInfo) {
        var storyboards = {};
        languages.forEach(function(language, i){
            storyboards[language.key] = $scope.initStoryboard(language, rawFile, fileInfo);
        });
        return storyboards;
    }

    $scope.initStoryboard = function(language, rawFile, fileInfo) {
        language = language || Settings.storyboardPreviewLanguage;
        var translations = $scope.getTranslations($scope.strings, $scope.storyboardLanguage);

        var storyboard = new IOSStringFile(fileInfo.name);
        storyboard.folderName = language.key + ".lproj";

        var fileLines = rawFile.split(/\n\s*\n/g);
        fileLines.forEach(function(val, i){
            var extract = /\/\*(.*)\*\/\s*"(.*)"\s*=\s*"(.*)"/.exec(val);
            var translation = "";
            if (!translations[extract[3]]) {
                console.warn("No " + language.name + " translation for key " + extract[3]);
            } else {
                translation = translations[extract[3]][language.key];
            }
            var stringObj = new IOSString(extract[2], translation, extract[1]);
            stringObj.originalValue = extract[3];
            storyboard.add(stringObj);
        })
        return storyboard;
    }

    $scope.stripBlankTranslations = function(iosStringFile){
        var trimmedList = [];
        for (var i = 0; i < iosStringFile.stringList.length; i++) {
            var string = iosStringFile.stringList[i];
            if (string.value) {
                trimmedList.push(string);
            }
        }
        iosStringFile.stringList = trimmedList;
        return iosStringFile;
    }

    $scope.getTranslations = function(stringArray, language){
        if (!stringArray) return false;
        var stringsObject = {};

        for (var i = 0; i < $scope.strings.length; i++) {
            stringsObject[$scope.strings[i][language.key]] = $scope.strings[i];
        }

        return stringsObject;
    }

    $scope.onAddFile = function(element){
        var file = element.files[0];
        $scope.loadFile(file, function(rawFile){
            //add file to scope
            $scope.storyboards = $scope.initStoryboards(Settings.languages, rawFile, file);
            $scope.$apply();
        })
    }

    $scope.loadFile = function(file, cb) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function(event){
            var result = event.target.result;
            cb(result);
        }
    }

    $scope.clearStoryboards = function(){
        $scope.storyboards = false;
    }

    $scope.init($stateParams.strings);
});
