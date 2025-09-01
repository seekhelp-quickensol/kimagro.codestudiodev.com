const { Op } = require("sequelize");
const designationModal = require("../../models/designationModal");
const bcrypt = require("bcryptjs");

const getAllDesignation = async (req, res) => {
  try {
    const adminList = await designationModal.findAll({
      attributes: ["id", "designation_name", "status"],
      where: { is_deleted: "0" },
      order: [["created_on", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Records fetched successfully",
      data: adminList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: err,
    });
  }
};

const addDesignation = async (req, res) => {
  const { designation_name } = req.body;

  try {
    const existing = await designationModal.findOne({
      where: { designation_name, is_deleted: "0" },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Designation already exists",
        // data: existing,
      });
    }

    const data = await designationModal.create({
      designation_name,
    });

    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error.message || error,
    });
  }
};

const getDesignationById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await designationModal.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching Record:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const updateDesignation = async (req, res) => {
  const { id } = req.params;
  const { designation_name } = req.body;

  try {
    const existing = await designationModal.findOne({
      where: { designation_name, is_deleted: "0", id: { [Op.ne]: id } },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Designation already exists",
        // data: existing,
      });
    }
    const updatedData = {
      ...req.body,
    };

    const [updated] = await designationModal.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const response = await designationModal.findByPk(id);
    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: response,
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

const getAjaxDesignation = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
  const columns = ["designation_name", "status"];
  const sortField = columns[colIndex] || "id";

  const whereClause = searchValue
    ? {
        [Op.or]: [{ designation_name: { [Op.like]: `%${searchValue}%` } }],
      }
    : {};

  whereClause.is_deleted = "0";
  const total = await designationModal.count();
  const filtered = await designationModal.count({ where: whereClause });

  const docs = await designationModal.findAll({
    where: whereClause,
    order: [["id", "DESC"]],
    offset: start,
    limit: length,
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.designation_name,
    row.status,
  ]);

  res.json({
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data,
  });
};

const uniqueDesignation = async (req, res) => {
  const { designation_name, exclude_id } = req.query;

  try {
    // Validate required parameter
    if (!designation_name || designation_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Designation name is required",
        data: {},
        isUnique: false,
      });
    }

    // Build query conditions
    const whereConditions = {
      designation_name: designation_name.trim(),
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

    const existing = await designationModal.findOne({
      where: whereConditions,
    });

    if (existing) {
      return res.status(200).json({
        success: true, // Changed to true since the API call succeeded
        message: "designation name already exists",
        data: {
          existingId: existing.id,
          existingName: existing.designation_name,
        },
        isUnique: false,
      });
    }

    // Department name is unique
    res.status(200).json({
      // Changed from 201 to 200
      success: true, // Changed to true since the API call succeeded
      message: "Designation name is available",
      data: {},
      isUnique: true,
    });
  } catch (error) {
    console.error("Error checking designation uniqueness:", error);

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
  addDesignation,
  getAllDesignation,
  addDesignation,
  getDesignationById,
  updateDesignation,
  getAjaxDesignation,
  uniqueDesignation,
};
