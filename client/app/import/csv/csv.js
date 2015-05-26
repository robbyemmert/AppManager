'use strict';

angular.module('appManagerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('csv', {
        url: '/import/csv',
        templateUrl: 'app/import/csv/csv.html',
        controller: 'CsvCtrl'
      });
  });