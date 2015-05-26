'use strict';

angular.module('appManagerApp')
.directive('editableString', function () {
    return {
        templateUrl: 'app/directives/editableString/editableString.html',
        restrict: 'EA',
        scope: {
            value: '=value',
            isEditing: '=editing'
        },
        link: function (scope, element, attrs) {
            scope.init = function(){
                scope.value = scope.value || "";
            }

            scope.editorSizeText = function(isBig){
                if (isBig) {
                    return "Smaller";
                } else {
                    return "Bigger";
                }
            }

            scope.init();
        }
    };
});
