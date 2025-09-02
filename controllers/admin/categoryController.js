const { Op, where } = require("sequelize");
const categoryModel = require("../../models/categoryModel");

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.findAll({
      where: {
        is_deleted: "0",
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

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categoryModel.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }

    const response = {
      id: category.id,
      title_english: category.title_english,
      title_hindi: category.title_hindi,
      upload_img: category.upload_img,
      status: category.status,
      is_deleted: category.is_deleted,
      created_on: category.created_on,
      updated_on: category.updated_on,
    };

    return res.status(200).json({
      success: true,
      message: "Record found successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createCategory = async (req, res) => {
  const { title_english } = req.body;

  try {
    const existing = await categoryModel.findOne({
      where: { title_english, is_deleted: "0" },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Category in english already exists",
        data: {},
      });
    }

    // const existingHi = await categoryModel.findOne({
    //   where: { title_hindi, is_deleted: "0" },
    // });

    // if (existingHi) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "Category in hindi already exists",
    //     data: {},
    //   });
    // }

    const newCategory = await categoryModel.create({
      ...req.body,
      upload_img: req.file?.filename || null,
    });

    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error.message || error,
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title_english, title_hindi } = req.body;

  try {
    const existing = await categoryModel.findOne({
      where: { title_english, is_deleted: "0", id: { [Op.ne]: id } },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Category in english already exists",
        data: {},
      });
    }

    const existingHi = await categoryModel.findOne({
      where: { title_hindi, is_deleted: "0", id: { [Op.ne]: id } },
    });

    if (existingHi) {
      return res.status(200).json({
        success: false,
        message: "Category in hindi already exists",
        data: {},
      });
    }

    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.upload_img = req.file.filename;
    }

    const [updated] = await categoryModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const updatedCategory = await categoryModel.findByPk(id);
    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating record",
      data: null,
      error: error,
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await categoryModel.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record not Found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "Record deleted successfully",
      data: {
        id: id,
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      error: error,
    });
  }
};

const getAjaxCategories = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";
  const filterdSearch = req.query?.search || "";

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
  const columns = ["title_english", "title_hindi", "upload_img", "status"];
  const sortField = columns[colIndex] || "id";

  const whereClause = {
    is_deleted: "0",
  };

  if (searchValue) {
    whereClause[Op.or] = [
      { title_english: { [Op.like]: `%${searchValue}%` } },
      { title_hindi: { [Op.like]: `%${searchValue}%` } },
    ];
  }

  if (filterdSearch !== "") {
    // Assuming filterdSearch is a string to match against title_english or title_hindi
    whereClause[Op.or] = [
      { title_english: { [Op.like]: `%${filterdSearch}%` } },
      { title_hindi: { [Op.like]: `%${filterdSearch}%` } },
    ];
  }

  const total = await categoryModel.count();
  const filtered = await categoryModel.count({ where: whereClause });

  const docs = await categoryModel.findAll({
    where: whereClause,
    order: [["id", "DESC"]],
    offset: start,
    limit: length,
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.title_english,
    row.title_hindi,
    row.upload_img,
    row.status,
  ]);

  res.json({
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data,
  });
};

const uniqueEnCategory = async (req, res) => {
  const { title_english, exclude_id } = req.query;

  try {
    // Validate required parameter
    if (!title_english || title_english.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "category name is required",
        data: {},
        isUnique: false,
      });
    }

    // Build query conditions
    const whereConditions = {
      title_english: title_english.trim(),
      is_deleted: "0",
    };

    // If exclude_id is provided (for edit mode), exclude that record
    if (exclude_id) {
      whereConditions.id = {
        [Op.ne]: exclude_id, // Assuming you're using Sequelize with Op.ne (not equal)
        // For raw SQL: whereConditions.id = { $ne: exclude_id }
        // For Mongoose: whereConditions._id = { $ne: exclude_id }
      };
    }

    const existing = await categoryModel.findOne({
      where: whereConditions,
    });

    if (existing) {
      return res.status(200).json({
        success: true, // Changed to true since the API call succeeded
        message: "category name already exists",
        data: {
          existingId: existing.id,
          existingName: existing.title_english,
        },
        isUnique: false,
      });
    }

    // Department name is unique
    res.status(200).json({
      // Changed from 201 to 200
      success: true, // Changed to true since the API call succeeded
      message: "Category name is available",
      data: {},
      isUnique: true,
    });
  } catch (error) {
    console.error("Error checking category uniqueness:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: {
        error: error.message || error,
        // Don't expose sensitive error details in production
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      isUnique: false, // Default to false on error for safety
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAjaxCategories,
  uniqueEnCategory,
};
