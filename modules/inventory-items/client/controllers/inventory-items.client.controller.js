'use strict';

// InventoryItems controller
angular.module('inventoryItems').controller('InventoryItemsController', ['$scope', '$stateParams', '$location', '$modal', 'toastr', 'Authentication', 'InventoryItems',
  function($scope, $stateParams, $location, $modal, toastr, Authentication, InventoryItems) {
    $scope.authentication = Authentication;

    // Create new InventoryItem
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'inventoryItemForm');

        return false;
      }

      // Create new InventoryItem object
      var inventoryItem = new InventoryItems({
        itemName: this.itemName,
        itemQuantity: this.itemQuantity
      });

      // Redirect after save
      inventoryItem.$save(function(response) {
        $location.path('inventoryItems/' + response.id);

        // Clear form fields
        $scope.itemName = '';
        $scope.itemQuantity = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Modal to create new Auction item
    $scope.open = function (inventoryItem) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'createAuctionModal.html',
        controller: 'AuctionDialogController',
        //size: 'sm',
        resolve: {
          selectedItem: function () {
            return inventoryItem;
          }
        }        
      });

    };    

    // Remove existing InventoryItem
    $scope.remove = function(inventoryItem) {
      if (inventoryItem) {

        inventoryItem.$remove();
        $location.path('inventoryItems');
      } else {
        $scope.inventoryItem.$remove(function() {
          $location.path('inventoryItems');
        });
      }
    };

    // Update existing InventoryItem
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'inventoryItemForm');
        return false;
      }

      var inventoryItem = $scope.inventoryItem;

      inventoryItem.$update(function() {
        $location.path('inventoryItems/' + inventoryItem.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of InventoryItems
    $scope.find = function() {
      $scope.inventoryItems = InventoryItems.query();
    };

    // Find existing InventoryItem
    $scope.findOne = function() {
      $scope.inventoryItem = InventoryItems.get({
        inventoryItemId: $stateParams.inventoryItemId
      });
    };
  }
]);