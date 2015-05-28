'use strict';

angular.module('appManagerApp')
.controller('PagesCtrl', function ($scope, $element, DataObject, DataCollection, growl, Settings) {
    $scope.init = function(){
        $scope.pages = new DataCollection('page');
        $scope.loadPages();

        $scope.settings = Settings;
        $scope.activeLanguage = Settings.languages[0];
        $scope.folderNames = {};
        Settings.languages.forEach(function(language, i){
            $scope.folderNames[language.key] = language.key + ".lproj";
        });

        $scope.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html', 'insertLink', 'wordcount', 'charcount']
        ];

        $scope.newPage = $scope.defaultNewPage();
        $scope.activeDoc = $scope.newPage;
    }

    $scope.downloadDocs = function(docs, folderNames){
        var zip = new JSZip();
        zip = $scope.zipDocuments(zip, docs, folderNames);

        var zipFile = zip.generate({
            type: "blob"
        });

        saveAs(zipFile, "App Pages Export.zip");
    }

    $scope.downloadDoc = function(doc, folderNames){
        var zip = new JSZip();
        zip = $scope.zipDocument(zip, doc, folderName);

        var zipFile = zip.generate({
            type: "blob"
        });

        saveAs(zipFile, doc.title + " Translations.zip");
    }

    $scope.zipDocuments = function(zip, docs, folderNames){
        for (var key in docs) {
            if (docs.hasOwnProperty(key)) {
                var doc = docs[key];
                zip = $scope.zipDocument(zip, doc, folderNames);
            }
        }

        return zip;
    }

    $scope.zipDocument = function(zip, doc, folderNames){
        for (var key in doc.translations) {
            if (doc.translations.hasOwnProperty(key)) {
                var translation = doc.translations[key];
                zip = $scope.zipTranslation(zip, translation, doc.file, folderNames[key]);
            }
        }

        return zip;
    }

    $scope.zipTranslation = function(zip, translation, fileName, folderName){
        var folder = zip.folder(folderName);
        folder.file(fileName, translation.content);

        return zip;
    }

    $scope.loadPages = function(){
        $scope.pages.query();
    }

    $scope.defaultNewPage = function(){
        return new DataObject('page');
    }

    $scope.saveDoc = function(doc){
        doc.save(function(){
            growl.addSuccessMessage("Your document was saved.");
            $scope.loadPages();
            $scope.newPage = $scope.defaultNewPage();
            $scope.activeDoc = $scope.newPage;
        });
    }

    $scope.getDocIndex = function(docArray, doc){
        if(!doc._id) {
            return false;
        }

        for (var key in docArray) {
            if (docArray.hasOwnProperty(key)) {
                var thisDoc = docArray[key];
                
            }
        }
    }

    $scope.deleteDoc = function(doc){
        doc.delete(function(){
            growl.addSuccessMessage("Your document was deleted.");
            $scope.loadPages();
            $scope.activeDoc = $scope.newPage;
        });
    }

    $scope.init();
});
