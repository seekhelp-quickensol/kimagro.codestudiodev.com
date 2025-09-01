const { Op, where } = require("sequelize");
const SKUModel = require("../../models/SKUModel");

const getAllskus = async (req, res) => {
  try {
    const skus = await SKUModel.findAll({
      where: {
        is_deleted: "0",
      },
    });

    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: skus,
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

const getSKUById = async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "en";

  try {
    const sku = await SKUModel.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
    });

    if (!sku) {
      return res.status(404).json({
        success: false,
        message: "SKU not found",
      });
    }
    const response = {
      id: sku.id,
      quantity: sku.quantity,
      unit: sku.unit,
      status: sku.status,
      is_deleted: sku.is_deleted,
      created_on: sku.created_on,
      updated_on: sku.updated_on,
    };

    return res.status(200).json({
      success: true,
      message: "Record found successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching SKU:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createSKU = async (req, res) => {
  const { quantity, unit } = req.body;
  try {
    const existing = await SKUModel.findOne({
      where: { quantity, unit, is_deleted: "0" },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Quantity already added for this unit",
        data: {},
      });
    }

    const newSKU = await SKUModel.create({
      ...req.body,
    });
    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: newSKU,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating record",
      data: null,
      error: error,
    });
  }
};

const deleteSKU = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await SKUModel.destroy({
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

const updateSKU = async (req, res) => {
  const { id } = req.params;

  const { quantity, unit } = req.body;
  try {
    const existing = await SKUModel.findOne({
      where: { quantity, unit, is_deleted: "0", id: { [Op.ne]: id } },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Quantity already added for this unit",
        data: {},
      });
    }
    const updatedData = {
      ...req.body,
    };
    const [updated] = await SKUModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const updatedSKU = await SKUModel.findByPk(id);
    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedSKU,
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

const getAjaxSKUS = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";
  const filteredStatus = req.query?.status || "all";

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
  const columns = ["quantity", "unit", "status"];
  const sortField = columns[colIndex] || "id";

  const parsedValue = parseInt(searchValue);
  const whereClause = searchValue
    ? {
        [Op.or]: [
          // Only include quantity condition if searchValue is a valid number
          ...(isNaN(parsedValue)
            ? []
            : [{ quantity: { [Op.eq]: parsedValue } }]),
          {
            unit: {
              [Op.like]: `%${searchValue}%`,
            },
          },
        ],
      }
    : {};

  if (filteredStatus !== "all") {
    whereClause.status = filteredStatus;
  }

  whereClause.is_deleted = "0";
  const total = await SKUModel.count();
  const filtered = await SKUModel.count({ where: whereClause });

  const docs = await SKUModel.findAll({
    where: whereClause,
    order: [["id", "DESC"]],
    offset: start,
    limit: length,
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.quantity,
    row.unit,
    row.status,
  ]);

  res.json({
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data,
  });
};

// const uniqueQuantity = async (req, res) => {
//   const { quantity, exclude_id } = req.query;

//   try {
//     // Validate required parameter
//     if (!quantity || quantity.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "quantity is required",
//         data: {},
//         isUnique: false,
//       });
//     }

//     // Build query conditions
//     const whereConditions = {
//       quantity: quantity.trim(),
//       is_deleted: "0",
//     };

//     // If exclude_id is provided (for edit mode), exclude that record
//     if (exclude_id) {
//       whereConditions.id = {
//         [Op.ne]: exclude_id, // Assuming you're using Sequelize with Op.ne (not equal)
//         // For raw SQL: whereConditions.id = { $ne: exclude_id }
//         // For Mongoose: whereConditions._id = { $ne: exclude_id }
//       };
//     }

//     const existing = await SKUModel.findOne({
//       where: whereConditions,
//     });

//     if (existing) {
//       return res.status(200).json({
//         success: true, // Changed to true since the API call succeeded
//         message: "quantity already exists",
//         data: {
//           existingId: existing.id,
//           existingName: existing.quantity,
//         },
//         isUnique: false,
//       });
//     }

//     // Department name is unique
//     res.status(200).json({
//       // Changed from 201 to 200
//       success: true, // Changed to true since the API call succeeded
//       message: "Quantity is available",
//       data: {},
//       isUnique: true,
//     });
//   } catch (error) {
//     console.error("Error checking category uniqueness:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       data: {
//         error: error.message || error,
//         // Don't expose sensitive error details in production
//         ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
//       },
//       isUnique: false, // Default to false on error for safety
//     });
//   }
// };
const uniqueSKU = async (req, res) => {
  const { quantity, unit, exclude_id } = req.query;

  try {
    // Validate required parameters
    if (!quantity || quantity.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
        data: {},
        isUnique: false,
      });
    }

    if (!unit || unit.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Unit is required",
        data: {},
        isUnique: false,
      });
    }

    // Build query conditions
    const whereConditions = {
      quantity: parseFloat(quantity.trim()), // Convert to number for proper comparison
      unit: unit.trim(),
      is_deleted: "0"
    };

    // If exclude_id is provided (for edit mode), exclude that record
    if (exclude_id) {
      whereConditions.id = {
        [Op.ne]: exclude_id
      };
    }

    const existing = await SKUModel.findOne({
      where: whereConditions,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "SKU combination already exists",
        data: { 
          existingId: existing.id,
          existingQuantity: existing.quantity,
          existingUnit: existing.unit,
          skuCode: existing.sku_code || `${existing.quantity}${existing.unit}`
        },
        isUnique: false,
      });
    }

    // SKU combination is unique
    res.status(200).json({
      success: true,
      message: "SKU combination is available",
      data: {},
      isUnique: true,
    });

  } catch (error) {
    console.error('Error checking SKU uniqueness:', error);
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: {
        error: error.message || error,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      isUnique: false,
    });
  }
};
module.exports = {
  getAllskus,
  getSKUById,
  createSKU,
  updateSKU,
  getAjaxSKUS,
  deleteSKU,
  uniqueSKU,
};
