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
        templateUrl: 'modules/inventory-items/client/views/list-inventory-items.client.view.html',
        data: {
          roles: ['user', 'admin']
        }        
      })
      .state('inventoryItems.create', {
        url: '/create',
        templateUrl: 'modules/inventory-items/client/views/create-inventory-item.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('inventoryItems.view', {
        url: '/:inventoryItemId',
        templateUrl: 'modules/inventory-items/client/views/view-inventory-item.client.view.html',
        data: {
          roles: ['user', 'admin']
        }        
      })
      .state('inventoryItems.edit', {
        url: '/:inventoryItemId/edit',
        templateUrl: 'modules/inventory-items/client/views/edit-inventory-item.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);