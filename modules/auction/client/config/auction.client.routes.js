'use strict';

// Configure the 'auction' module routes
angular.module('auction').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('auction', {
        url: '/auction',
        templateUrl: 'modules/auction/client/views/auction.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);