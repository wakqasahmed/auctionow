'use strict';

angular.module('user').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.createInitialItems = function(element, index, array) {
      //console.log('a[' + index + '] = ' + element);

      var inventoryItem = element;
      $http.post('/api/inventoryItems', inventoryItem).success(function(inventory){
        console.log( (index+1) + " items added successfully");
        
        }).error(function(response) {
          $scope.error = response.message;
      });

    };

    $scope.signup = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $scope.credentials.firstName = "John";
      $scope.credentials.lastName = "Doe";
      $scope.credentials.email = $scope.credentials.username + "@crossover.com";                 
      $scope.credentials.coinsBalance = 1000;

      $http.post('/api/auth/signup', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        $scope.initialInventory = [
          {
            "itemName": "Breads",
            "itemQuantity": 30,
            "userId": $scope.authentication.user.id
          },
          {
            "itemName": "Carrots",
            "itemQuantity": 18,
            "userId": $scope.authentication.user.id
          },
          {
            "itemName": "Diamond",
            "itemQuantity": 1,
            "userId": $scope.authentication.user.id
          }
        ];

        $scope.initialInventory.forEach($scope.createInitialItems);

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);

      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function(isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      $scope.credentials.password = "Supersecret123@"; 
      $http.post('/api/auth/signin', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function(response) {

        $scope.error = response.message;
        if(response.status === 400){
          console.log('status 400');
          $scope.signup(true);
        }
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);