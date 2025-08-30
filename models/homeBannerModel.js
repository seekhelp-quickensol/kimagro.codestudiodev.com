const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const homeBannerModel = sequelize.define(
  "tbl_home_banner",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title_hindi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    upload_video: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sub_title_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sub_title_hindi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descr_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descr_hindi: {
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
    tableName: "tbl_home_banner",
  }
);

module.exports = homeBannerModel;
