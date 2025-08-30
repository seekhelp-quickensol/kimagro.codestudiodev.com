const { Op, where } = require("sequelize");
const categoryModel = require("../../models/categoryModel");

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.findAll({
      where: {
        is_deleted: "0",
        status:"1"
      },
    });

    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
      error: error,
    });
  }
};

module.exports = {
    getCategories,
  };
  