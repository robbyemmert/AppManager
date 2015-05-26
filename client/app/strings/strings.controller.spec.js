'use strict';

describe('Controller: StringsCtrl', function () {

  // load the controller's module
  beforeEach(module('appManagerApp'));

  var StringsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StringsCtrl = $controller('StringsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
