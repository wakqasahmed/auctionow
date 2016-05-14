'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  inventoryItemsPolicy = require('../policies/inventory-items.server.policy'),
  inventoryItems = require(path.resolve('./modules/inventory-items/server/controllers/inventory-items.server.controller'));


module.exports = function(app) {

  // Articles collection routes
  app.route('/api/inventoryItems')
    .all(inventoryItemsPolicy.isAllowed)
    .get(inventoryItems.list)
    .post(inventoryItems.create);

  // Single inventoryItem routes
  app.route('/api/inventoryItems/:inventoryItemId')
    .all(inventoryItemsPolicy.isAllowed)
    .get(inventoryItems.read)
    .put(inventoryItems.update)
    .delete(inventoryItems.delete);

  // Finish by binding the inventoryItem middleware
  app.param('inventoryItemId', inventoryItems.inventoryItemByID);

};