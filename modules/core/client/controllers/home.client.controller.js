'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', '$window', 'Authentication',
  function($scope, $location, $window, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    if(Object.keys($scope.authentication.user).length === 0 && $location.path() !== '/authentication/signin') {
    	//alert('taking to sign in page');
    	//$location.path('authentication/signin');
    	$window.location = '/authentication/signin';
    }
  }
]);