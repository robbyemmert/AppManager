'use strict';

describe('Controller: AndroidExportStringsCtrl', function () {

  // load the controller's module
  beforeEach(module('appManagerApp'));

  var AndroidExportStringsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AndroidExportStringsCtrl = $controller('AndroidExportStringsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
