'use strict';

(function() {
  // InventoryItems Controller Spec
  describe('InventoryItems Controller Tests', function() {
    // Initialize global variables
    var InventoryItemsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      InventoryItems,
      mockInventoryItem;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _InventoryItems_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      InventoryItems = _InventoryItems_;

      // create mock inventory item
      mockInventoryItem = new InventoryItems({
        id: '525a8422f6d0f87f0e407a33',
        itemName: 'Item Name',
        itemQuantity: 5
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the InventoryItems controller.
      InventoryItemsController = $controller('InventoryItemsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one inventoryItem object fetched from XHR', inject(function(InventoryItems) {
      // Create a sample inventoryItems array that includes the new inventoryItem
      var sampleInventoryItems = [mockInventoryItem];

      // Set GET response
      $httpBackend.expectGET('api/inventoryItems').respond(sampleInventoryItems);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.inventoryItems).toEqualData(sampleInventoryItems);
    }));

    it('$scope.findOne() should create an array with one inventoryItem object fetched from XHR using a inventoryItemId URL parameter', inject(function(InventoryItems) {
      // Set the URL parameter
      $stateParams.inventoryItemId = mockInventoryItem.id;

      // Set GET response
      $httpBackend.expectGET(/api\/inventoryItems\/([0-9a-fA-F]{24})$/).respond(mockInventoryItem);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.inventoryItem).toEqualData(mockInventoryItem);
    }));

    describe('$scope.create()', function() {
      var sampleInventoryItemPostData;

      beforeEach(function() {
        // Create a sample inventoryItem object
        sampleInventoryItemPostData = new InventoryItems({
          itemName: 'Item Name',
          itemQuantity: 5
        });

        // Fixture mock form input values
        scope.itemName = 'Item Name';
        scope.itemQuantity = 5;

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function(InventoryItems) {
        // Set POST response
        $httpBackend.expectPOST('api/inventoryItems', sampleInventoryItemPostData).respond(mockInventoryItem);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the inventoryItem was created
        expect($location.path.calls.mostRecent().args[0]).toBe('inventoryItems/' + mockInventoryItem.id);
      }));

      it('should set scope.error if save error', function() {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/inventoryItems', sampleInventoryItemPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function() {
      beforeEach(function() {
        // Mock inventoryItem in scope
        scope.inventoryItem = mockInventoryItem;
      });

      it('should update a valid inventoryItem', inject(function(InventoryItems) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/inventoryItems\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/inventoryItems/' + mockInventoryItem.id);
      }));

      it('should set scope.error to error response message', inject(function(InventoryItems) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/inventoryItems\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(inventoryItem)', function() {
      beforeEach(function() {
        // Create new inventoryItems array and include the inventoryItem
        scope.inventoryItems = [mockInventoryItem, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/inventoryItems\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockInventoryItem);
      });

      it('should send a DELETE request with a valid inventoryItemId and remove the inventoryItem from the scope', inject(function(InventoryItems) {
        expect(scope.inventoryItems.length).toBe(2); //Because of the empty object - must be 1
      }));
    });

    describe('scope.remove()', function() {
      beforeEach(function() {
        spyOn($location, 'path');
        scope.inventoryItem = mockInventoryItem;

        $httpBackend.expectDELETE(/api\/inventoryItems\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to inventoryItems', function() {
        expect($location.path).toHaveBeenCalledWith('inventoryItems');
      });
    });
  });
}());