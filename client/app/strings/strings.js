'use strict';

angular.module('appManagerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('strings', {
        url: '/strings',
        templateUrl: 'app/strings/strings.html',
        controller: 'StringsCtrl'
      });
  });