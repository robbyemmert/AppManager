'use strict';

describe('Directive: editableString', function () {

  // load the directive's module and view
  beforeEach(module('appManagerApp'));
  beforeEach(module('app/directives/editableString/editableString.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<editable-string></editable-string>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the editableString directive');
  }));
});