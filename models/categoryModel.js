const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const categoryModel = sequelize.define('tbl_category_master', {
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
  upload_img: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: false,
    defaultValue: '1',
  },
  is_deleted: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: false,
    defaultValue: '0',
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'tbl_category_master',
});

module.exports = categoryModel;