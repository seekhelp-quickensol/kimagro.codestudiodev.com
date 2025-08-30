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
      where: { designation_name, is_deleted: "0" },
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
    order: [[sortField, dir]],
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

module.exports = {
  addDesignation,
  getAllDesignation,
  addDesignation,
  getDesignationById,
  updateDesignation,
  getAjaxDesignation,
};
