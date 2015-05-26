'use strict';

angular.module('appManagerApp')
  .directive('picker', function () {
    return {
      templateUrl: 'app/directives/picker/picker.html',
      restrict: 'EA',
      scope: {
          options: '=options',
          name: '=name',
          selection: '=pickerValue'
      },
      link: function (scope, element, attrs) {
          console.log(scope.name);
          console.log(scope.value);
      }
    };
  });
