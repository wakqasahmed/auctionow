"use strict";

module.exports = function(sequelize, DataTypes) {

  var InventoryItem = sequelize.define('inventoryItem', {
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: "Item Name must be between 1 and 100 characters in length"
        },
      }
    },
    itemQuantity: {
      type: DataTypes.INTEGER,
      default: 1
    }
  }, {
    associate: function(models) {
      InventoryItem.belongsTo(models.user);
    }
  });
  return InventoryItem;
};