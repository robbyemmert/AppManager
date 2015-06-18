'use strict';

angular.module('appManagerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('android-export-strings', {
        url: '/android/export-strings',
        templateUrl: 'app/android/export-strings/android-export-strings/android-export-strings.html',
        controller: 'AndroidExportStringsCtrl',
        params: {
            strings: false
        }
      });
  });
