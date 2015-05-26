'use strict';

describe('Controller: ExportStringsCtrl', function () {

  // load the controller's module
  beforeEach(module('appManagerApp'));

  var ExportStringsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExportStringsCtrl = $controller('ExportStringsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
