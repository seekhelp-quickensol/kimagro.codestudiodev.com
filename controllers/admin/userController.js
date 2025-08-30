const { Op } = require("sequelize");
const authModel = require("../../models/authModel");
const bcrypt = require("bcryptjs");

const departmentModel = require("../../models/departmentModel");
const designationModel = require("../../models/designationModal");

const getAllUser = async (req, res) => {
  try {
    const adminList = await authModel.findAll({
      attributes: [
        "id",
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "username",
        "department_id",
        "designation_id",
        "status",
      ],
      where: { is_deleted: "0" },
      order: [["created_on", "DESC"]],
    });

    const departmentIds = adminList.map((user) => user.department_id);
    const designationIds = adminList.map((user) => user.designation_id);

    const departments =
      await authModel.sequelize.models.tbl_departments.findAll({
        attributes: ["id", "department_name"],
        where: { id: departmentIds, is_deleted: "0" },
      });
    const designations =
      await authModel.sequelize.models.tbl_designations.findAll({
        attributes: ["id", "designation_name"],
        where: { id: designationIds, is_deleted: "0" },
      });
    adminList.forEach((user) => {
      const department = departments.find((d) => d.id === user.department_id);
      const designation = designations.find(
        (d) => d.id === user.designation_id
      );
      user.department_name = department
        ? department.department_name
        : "Unknown";
      user.designation_name = designation
        ? designation.designation_name
        : "Unknown";
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

const addUser = async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    password,
    username,
    department_id,
    designation_id,
  } = req.body;

  try {
    const existing = await authModel.findOne({ where: { email } });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await authModel.create({
      first_name,
      middle_name,
      last_name,
      email,
      password: hashed,
      username,
      department_id,
      designation_id,
    });

    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          email: user.email,
          username: user.username,
          department_id: user.department_id,
          designation_id: user.designation_id,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: err,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await authModel.findOne({
      where: {
        id,
        is_deleted: "0",
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
const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedData = {
      ...req.body,
    };

    const [updated] = await authModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const response = await authModel.findByPk(id);
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

const getAjaxUser = async (req, res) => {
  try {
    const draw = parseInt(req.body.draw) || 1;
    const start = parseInt(req.body.start) || 0;
    const length = parseInt(req.body.length) || 10;
    const order = req.body.order || [];
    const searchValue = req.body.search?.value || "";
    // const filteredStatus = req.query?.status || "all";
    const filteredDepart = req.query?.department_id || "all";
    const filteredName = req.query?.name || "";
    const fulteredUserName = req.query?.username || "";

    const colIndex = order[0]?.column || 0;
    const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";

    const columns = [
      "first_name",
      "middle_name",
      "last_name",
      "username",
      "email",
      "password",
      "designation_name",
      "department_name",
    ];

    const sortField = columns[colIndex] || "id";

    const whereClause = searchValue
      ? {
        [Op.or]: [
          { first_name: { [Op.like]: `%${searchValue}%` } },
          { middle_name: { [Op.like]: `%${searchValue}%` } },
          { last_name: { [Op.like]: `%${searchValue}%` } },
          { username: { [Op.like]: `%${searchValue}%` } },
          { email: { [Op.like]: `%${searchValue}%` } },
        ],
      }
      : {};

    if (filteredName !== "") {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${filteredName}%` } },
        { middle_name: { [Op.like]: `%${filteredName}%` } },
        { last_name: { [Op.like]: `%${filteredName}%` } },
      ];
    }

    if (fulteredUserName !== "") {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${fulteredUserName}%` } },
       
      ];
    }

    if (filteredDepart !== "all") {
      whereClause.department_id = filteredDepart;
    }

    const total = await authModel.count({ where: { is_deleted: "0" } });

    // Filtered records
    const filtered = await authModel.count({
      where: {
        ...whereClause,
        is_deleted: "0",
      },
    });

    const users = await authModel.findAll({
      where: {
        ...whereClause,
        is_deleted: "0",
      },
      order: [[sortField, dir]],
      offset: start,
      limit: length,
      include: [
        {
          model: departmentModel,
          as: "department",
          attributes: ["department_name"],
          where: { is_deleted: "0" },
          required: false, // Ensures that only users with a valid department are returned
        },
        {
          model: designationModel,
          attributes: ["designation_name"],
          as: "designation", // 👈 required alias
          where: { is_deleted: "0" }, // Ensure we only fetch non-deleted designations
          required: false, // Ensures that only users with a valid designation are returned
        },
      ],
    });

    // Format data for DataTables
    const data = users.map((user, i) => [
      i + 1 + start,
      user.id,
      user.first_name,
      user.middle_name,
      user.last_name,
      user.designation?.designation_name || "Unknown",
      user.department?.department_name || "Unknown",
      user.email,
      user.username,
      user.status,
    ]);

    res.json({
      draw,
      recordsTotal: total,
      recordsFiltered: filtered,
      data,
    });
  } catch (error) {
    console.error("Error in getAjaxUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addUser,
  getAllUser,
  addUser,
  getUserById,
  updateUser,
  getAjaxUser,
};
