const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const mediaModel = require("./mediaModel");

const mediaModuleModel = sequelize.define(
  "tbl_media",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    media_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    media_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tbl_media_master",
        key: "id",
      },
    },
    upload_photo: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    upload_thumbnail: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    upload_video: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    descr_english: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    descr_hindi: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
    tableName: "tbl_media",
  }
);

mediaModuleModel.belongsTo(mediaModel, {
  foreignKey: "media_category_id",
  targetKey: "id",
  as: "media",
});

module.exports = mediaModuleModel;
