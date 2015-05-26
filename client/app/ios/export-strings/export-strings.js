'use strict';

angular.module('appManagerApp')
.config(function ($stateProvider) {
    $stateProvider
    .state('ios-export-strings', {
        url: '/ios/export-strings',
        templateUrl: 'app/ios/export-strings/export-strings.html',
        controller: 'ExportStringsCtrl',
        params: {
            strings: false
        }
    });
});
