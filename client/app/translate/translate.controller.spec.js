'use strict';

describe('Controller: TranslateCtrl', function () {

  // load the controller's module
  beforeEach(module('appManagerApp'));

  var TranslateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TranslateCtrl = $controller('TranslateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});