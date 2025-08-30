const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connectDB");

const userModel = sequelize.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
 {
  timestamps: true,
});

module.exports = userModel;
