'use strict';

// Configuring the InventoryItems module
angular.module('inventoryItems').run(['Menus',
  function(Menus) {
    // Add the inventoryItems dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Inventory Items',
      state: 'inventoryItems',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'inventoryItems', {
      title: 'List Inventory Items',
      state: 'inventoryItems.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'inventoryItems', {
      title: 'Create Inventory Items',
      state: 'inventoryItems.create',
      roles: ['user']
    });
  }
]);