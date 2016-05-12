'use strict';

// Setting up route
angular.module('inventoryItems').config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing

    $stateProvider
      .state('inventoryItems', {
        abstract: true,
        url: '/inventoryItems',
        template: '<ui-view/>'
      })
      .state('inventoryItems.list', {
        url: '',
        templateUrl: 'modules/inventoryItems/client/views/list-inventoryItems.client.view.html',
        data: {
          roles: ['user', 'admin']
        }        
      })
      .state('inventoryItems.create', {
        url: '/create',
        templateUrl: 'modules/inventoryItems/client/views/create-inventoryItem.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('inventoryItems.view', {
        url: '/:inventoryItemId',
        templateUrl: 'modules/inventoryItems/client/views/view-inventoryItem.client.view.html',
        data: {
          roles: ['user', 'admin']
        }        
      })
      .state('inventoryItems.edit', {
        url: '/:inventoryItemId/edit',
        templateUrl: 'modules/inventoryItems/client/views/edit-inventoryItem.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);