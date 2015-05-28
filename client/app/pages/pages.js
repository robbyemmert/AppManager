'use strict';

angular.module('appManagerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pages', {
        url: '/pages',
        templateUrl: 'app/pages/pages.html',
        controller: 'PagesCtrl'
      });
  });