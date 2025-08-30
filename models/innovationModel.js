const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const innovationModel = sequelize.define(
  "tbl_innovation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    upload_icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    upload_img: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bio_balance_eng: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bio_balance_hindi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descr_english: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descr_hindi: {
      type: DataTypes.TEXT,
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
    tableName: "tbl_innovation",
  }
);

module.exports = innovationModel;
