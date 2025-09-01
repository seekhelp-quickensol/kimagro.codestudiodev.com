const { Op } = require("sequelize");
const departmentModel = require("../../models/departmentModel");

const getAllDepartment = async (req, res) => {
  try {
    const adminList = await departmentModel.findAll({
      attributes: ["id", "department_name", "status"],
      where: { is_deleted: "0" },
      order: [["id", "DESC"]],
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

const addDepartment = async (req, res) => {
  const { department_name } = req.body;

  try {
    const existing = await departmentModel.findOne({
      where: { department_name, is_deleted: "0" },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Department already exists",
        data: {},
      });
    }

    const data = await departmentModel.create({
      department_name,
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

const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await departmentModel.findOne({
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
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { department_name } = req.body;

  try {
    const existing = await departmentModel.findOne({
      where: { department_name, is_deleted: "0", id: { [Op.ne]: id } },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Department already exists",
        data: {},
      });
    }

    const updatedData = {
      ...req.body,
    };

    const [updated] = await departmentModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const response = await departmentModel.findByPk(id);
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

const getAjaxDepartment = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";
  const filteredStatus = req.query?.status || "all";

  const columns = ["department_name", "status"];
  const colIndex = order[0]?.column;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";

  const sortField =
    typeof colIndex !== "undefined" ? columns[colIndex] || "id" : "id";
  const sortDirection = typeof colIndex !== "undefined" ? dir : "DESC";

  const whereClause = searchValue
    ? {
        [Op.and]: [
          { is_deleted: "0" },
          {
            [Op.or]: [{ department_name: { [Op.like]: `%${searchValue}%` } }],
          },
        ],
      }
    : { is_deleted: "0" };

  if (filteredStatus !== "all") {
    whereClause.status = filteredStatus;
  }

  const total = await departmentModel.count({ where: { is_deleted: "0" } });
  const filtered = await departmentModel.count({ where: whereClause });

  const docs = await departmentModel.findAll({
    where: whereClause,
    order: [["id", "DESC"]],
    offset: start,
    limit: length,
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.department_name,
    row.status,
  ]);

  res.json({
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data,
  });
};

const uniqueDepartment = async (req, res) => {
  const { department_name } = req.query;

  try {
    const existing = await departmentModel.findOne({
      where: { department_name, is_deleted: "0" },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Department already exists",
        data: {},
        isUnique: false,
      });
    }

    res.status(201).json({
      success: false,
      message: "Record is unique",
      data: {},
      isUnique: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error.message || error,
    });
  }
};

module.exports = {
  addDepartment,
  getAllDepartment,
  addDepartment,
  getDepartmentById,
  updateDepartment,
  getAjaxDepartment,
  uniqueDepartment,
};
