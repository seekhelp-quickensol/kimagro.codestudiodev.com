const { Op, where } = require("sequelize");
const innovationModel = require("../../models/innovationModel");
const productModel = require("../../models/productModel");

const getAllInnovations = async (req, res) => {
  try {
    const innovations = await innovationModel.findAll({
      where: {
        is_deleted: "0", // innovation itself must not be deleted
      },
      include: [
        {
          model: productModel,
          as: "product",
          where: {
            is_deleted: "0", // filter products that are not deleted
          },
          required: true, // ensures only innovations with matching products are returned
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: innovations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
      error: error.message,
    });
  }
};

const geInnovationById = async (req, res) => {
  const { productId } = req.params;

  try {
    const innovation = await innovationModel.findOne({
      where: {
        product_id: productId,
        is_deleted: "0",
        status: "1",
      },
    });

    if (!innovation) {
      return res.status(200).json({ success: true, data: null });
    }

    return res.status(200).json({
      success: true,
      data: { id: innovation.id },
    });
  } catch (error) {
    console.error("Error fetching innovation by product ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getInnovationDataById = async (req, res) => {
  const { id } = req.params;

  try {
    const innovation = await innovationModel.findOne({
      where: {
        id,
        is_deleted: "0",
        status: "1",
      },
    });

    if (!innovation) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: innovation,
    });
  } catch (error) {
    console.error("Error fetching Record:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createInnovation = async (req, res) => {
  try {
    const files = req.files || {};

    const newInnovation = await innovationModel.create({
      ...req.body,
      product_id: req.body.product_id,
      upload_icon: files.upload_icon?.[0]?.filename || null,
      upload_img: files.upload_img?.[0]?.filename || null,
    });

    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: newInnovation,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating record",
      data: null,
      error: error.message || error,
    });
  }
};

const updateInnovation = async (req, res) => {
  const { id } = req.params;
  const files = req.files || {};
  try {
    const existingInnovation = await innovationModel.findByPk(id);
    if (!existingInnovation) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }
    const updatedData = {
      ...req.body,
      upload_icon: files.upload_icon?.[0]?.filename,
      upload_img: files.upload_img?.[0]?.filename,
    };

    const [updated] = await innovationModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const updatedInnovation = await innovationModel.findByPk(id);

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedInnovation,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating record",
      data: null,
      error: error.message || error,
    });
  }
};

const deleteInnovation = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await innovationModel.destroy({
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

const getAjaxInnovations = async (req, res) => {
  const draw = 1;
  const start = 0;
  const length = 1000;
  const searchValue = req.body.search || "";

  const order = req.body.order || [];
  const statusFilter = req.query.status || req.body.status || "all";

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
  const columns = [
    "bio_balance_eng",
    "bio_balance_hindi",
    "upload_img",
    "upload_icon",
    "upload_img",
    "descr_english",
    "descr_hindi",
    "status",
  ];
  const sortField = columns[colIndex] || "id";

  let whereClause = {};
  if (searchValue) {
    whereClause[Op.or] = [
      { bio_balance_eng: { [Op.like]: `%${searchValue}%` } },
      { bio_balance_hindi: { [Op.like]: `%${searchValue}%` } },
      { descr_english: { [Op.like]: `%${searchValue}%` } },
      { descr_hindi: { [Op.like]: `%${searchValue}%` } },
    ];
  }
  whereClause.is_deleted = "0";
  if (statusFilter !== "all") {
    whereClause.status = statusFilter;
  }

  const total = await innovationModel.count();
  const filtered = await innovationModel.count({ where: whereClause });

  const docs = await innovationModel.findAll({
    where: whereClause,
    order: [["id", "DESC"]],
    offset: start,
    limit: length,
  });

  const data = docs.map((user) => ({
    id: user.id,
    bio_balance_eng: user.bio_balance_eng,
    bio_balance_hindi: user.bio_balance_hindi,
    descr_english: user.descr_english,
    descr_hindi: user.descr_hindi,
    upload_img: user.upload_img,
    status: user.status,
  }));

  res.json({
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data,
  });
};

module.exports = {
  getAllInnovations,
  geInnovationById,
  createInnovation,
  updateInnovation,
  deleteInnovation,
  getAjaxInnovations,
  getInnovationDataById,
};
