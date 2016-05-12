'use strict';

//InventoryItems service used for communicating with the inventoryItems REST endpoints
angular.module('inventoryItems').factory('InventoryItems', ['$resource',
  function($resource) {
    return $resource('api/inventoryItems/:inventoryItemId', {
      inventoryItemId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);