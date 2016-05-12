'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  InventoryItem = db.inventoryItem;

/**
 * Create a inventoryItem
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;

  InventoryItem.create(req.body).then(function(inventoryItem) {
    if (!inventoryItem) {
      return res.send('users/signup', {
        errors: 'Could not create the inventoryItem'
      });
    } else {
      return res.jsonp(inventoryItem);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current inventoryItem
 */
exports.read = function(req, res) {
  res.json(req.inventoryItem);
};

/**
 * Update a inventoryItem
 */
exports.update = function(req, res) {
  var inventoryItem = req.inventoryItem;

  inventoryItem.updateAttributes({
    itemName: req.body.itemName,
    itemQuantity: req.body.itemQuantity
  }).then(function(inventoryItem) {
    res.json(inventoryItem);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an inventoryItem
 */
exports.delete = function(req, res) {
  var inventoryItem = req.inventoryItem;

  // Find the inventoryItem
  InventoryItem.findById(inventoryItem.id).then(function(inventoryItem) {
    if (inventoryItem) {

      // Delete the inventoryItem
      inventoryItem.destroy().then(function() {
        return res.json(inventoryItem);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the inventoryItem'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of InventoryItems
 */
exports.list = function(req, res) {

  InventoryItem.findAll({
    where: {userId: req.user.id}
  }).then(function(inventoryItems) {
    if (!inventoryItems) {
      return res.status(404).send({
        message: 'No inventoryItems found'
      });
    } else {
      res.json(inventoryItems);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * InventoryItem middleware
 */
exports.inventoryItemByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'InventoryItem is invalid'
    });
  }

  InventoryItem.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(inventoryItem) {
    if (!inventoryItem) {
      return res.status(404).send({
        message: 'No inventoryItem with that identifier has been found'
      });
    } else {
      req.inventoryItem = inventoryItem;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};