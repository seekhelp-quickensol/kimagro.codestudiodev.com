const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const skuModel = require("./SKUModel");
const categoryModel = require("./categoryModel");
const innovationModel = require("./innovationModel");
 
const productModel = sequelize.define(
  "tbl_product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
 
    product_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
 
    product_name_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
 
    product_name_hindi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  
    product_tag_english: {
      type: DataTypes.STRING(500),
      allowNull: true,
      get() {
        const raw = this.getDataValue("product_tag_english");
        return raw ? raw.split(",").map((tag) => tag.trim()) : [];
      },
      set(value) {
        this.setDataValue(
          "product_tag_english",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
 
    product_tag_hindi: {
      type: DataTypes.STRING(500),
      allowNull: true,
      get() {
        const raw = this.getDataValue("product_tag_hindi");
        return raw ? raw.split(",").map((tag) => tag.trim()) : [];
      },
      set(value) {
        this.setDataValue(
          "product_tag_hindi",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
 
    product_img: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
 
    product_title_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
 
    product_title_hindi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
 
    sku_id: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const raw = this.getDataValue("sku_id");
        return raw ? raw.split(",") : [];
      },
      set(value) {
        this.setDataValue(
          "sku_id",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
 
    upload_multiple_img: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      get() {
        const raw = this.getDataValue("upload_multiple_img");
        return raw ? raw.split(",") : [];
      },
      set(value) {
        this.setDataValue(
          "upload_multiple_img",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
 
    short_descr_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
 
    short_descr_hindi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
 
    upload_brouch_english: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
 
    upload_brouch_hindi: {
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
    tableName: "tbl_product",
  }
);
productModel.belongsTo(skuModel, {
  foreignKey: "sku_id",
  targetKey: "id",
  as: "sku",
});

 
productModel.belongsTo(categoryModel, {
  foreignKey: "product_category_id",
  targetKey: "id",
  as: "category",
});

productModel.hasMany(innovationModel, {
  foreignKey: "product_id",
  sourceKey: "id",
  as: "innovations",
});

innovationModel.belongsTo(productModel, {
  foreignKey: "product_id",
  targetKey: "id",
  as: "product",
});

 
module.exports = productModel;
 
 