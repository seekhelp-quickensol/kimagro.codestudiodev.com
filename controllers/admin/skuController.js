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
              [Op.like]: `%${searchValue}%`
            }
          }
        ]
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
    order: [[sortField, dir]],
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

module.exports = {
  getAllskus,
  getSKUById,
  createSKU,
  updateSKU,
  getAjaxSKUS,
  deleteSKU,
};
