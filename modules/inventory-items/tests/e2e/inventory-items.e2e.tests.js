'use strict';

describe('InventoryItems E2E Tests:', function() {
  describe('Test inventory items page', function() {
    it('Should report missing credentials', function() {
      browser.get('http://localhost:3000/inventoryItems');
      expect(element.all(by.repeater('inventoryItem in inventoryItems')).count()).toEqual(0);
    });
  });
});