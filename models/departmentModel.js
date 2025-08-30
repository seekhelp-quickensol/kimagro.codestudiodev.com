const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/db');

const department_Model = sequelize.define(
  "tbl_department",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    department_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "1",
      comment: "0=inactive,1=active",
    },
    is_deleted: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "0",
      comment: "0=not deleted,1=deleted",
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
    timestamps: true,
    createdAt: "created_on",
    updatedAt: "updated_on",
    tableName: "tbl_department",
  }
);

// authModel.belongsTo(DepartmentModel, { foreignKey: "department_id" });
// authModel.belongsTo(DesignationModel, { foreignKey: "designation_id" });

module.exports = department_Model;
