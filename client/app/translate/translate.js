'use strict';

angular.module('appManagerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('translate', {
        url: '/translate',
        templateUrl: 'app/translate/translate.html',
        controller: 'TranslateCtrl'
      });
  });