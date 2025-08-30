const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const mediaModel = sequelize.define(
  "tbl_media_master",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    media_category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name_hindi: {
      type: DataTypes.STRING(100),
      allowNull: false, 
    },
    status: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "1",
    },
    is_deleted: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "0",
    },
    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "tbl_media_master",
  }
);

module.exports = mediaModel;
