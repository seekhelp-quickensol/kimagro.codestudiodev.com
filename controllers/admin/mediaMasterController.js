const { Op, where } = require("sequelize");
const mediaModel = require("../../models/mediaModel");

const getAllcategoryMaster = async (req, res) => {
  try {
    const medias = await mediaModel.findAll({
      where: {
        is_deleted: "0",
      },
    });

    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: medias,
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

const getMediaById = async (req, res) => {
  const { id } = req.params;

  try {
    const media = await mediaModel.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const response = {
      id: media.id,
      media_category: media.media_category,
      name_english: media.name_english,
      name_hindi: media.name_hindi,
      status: media.status,
      is_deleted: media.is_deleted,
      created_on: media.created_on,
      updated_on: media.updated_on,
    };

    return res.status(200).json({
      success: true,
      message: "Record found successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching Media:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createMedia = async (req, res) => {
  const { media_category, name_english, name_hindi } = req.body;

  try {
    const existing = await mediaModel.findOne({
      where: { media_category, name_english, is_deleted: "0" },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Category (English) already exists for this media type",
        data: {},
      });
    }

    const existingHi = await mediaModel.findOne({
      where: { media_category, name_hindi, is_deleted: "0" },
    });

    if (existingHi) {
      return res.status(200).json({
        success: false,
        message: "Category (Hindi) already exists for this media type",
        data:{},
      });
    }

    const newMedia = await mediaModel.create({
      ...req.body,
    });
    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: newMedia,
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

const deleteMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await mediaModel.destroy({
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

const updateMedia = async (req, res) => {
  const { id } = req.params;
  const { media_category, name_english, name_hindi } = req.body;

  try {
    const existing = await mediaModel.findOne({
      where: { media_category, name_english, is_deleted: "0" ,id: { [Op.ne]: id }},
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Category (English) already exists for this media type",
        data:{},
      });
    }

    const existingHi = await mediaModel.findOne({
      where: { media_category, name_hindi, is_deleted: "0" ,id: { [Op.ne]: id }},
    });

    if (existingHi) {
      return res.status(200).json({
        success: false,
        message: "Category (Hindi) already exists for this media type",
       data:{},
      });
    }

    const updatedData = {
      ...req.body,
    };
    const [updated] = await mediaModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const updatedMedia = await mediaModel.findByPk(id);
    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedMedia,
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

const getAjaxMedias = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";
  // const filteredStatus = req.query?.status || "all";
  const filteredMedia = req.query?.media_category || "all";

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
  const columns = ["media_category", "name_english", "name_hindi", "status"];
  const sortField = columns[colIndex] || "id";

  const whereClause = {
    is_deleted: "0",
  };

  if (searchValue) {
    whereClause[Op.or] = [
      { media_category: { [Op.like]: `%${searchValue}%` } },
      { name_english: { [Op.like]: `%${searchValue}%` } },
      { name_hindi: { [Op.like]: `%${searchValue}%` } },
    ];
  }

  if (filteredMedia !== "all") {
    whereClause.media_category = filteredMedia;
  }

  // if (filteredStatus !== "all") {
  //   whereClause.status = filteredStatus;
  // }

  const total = await mediaModel.count();
  const filtered = await mediaModel.count({ where: whereClause });

  const docs = await mediaModel.findAll({
    where: whereClause,
    order: [[sortField, dir]],
    offset: start,
    limit: length,
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.media_category,
    row.name_english,
    row.name_hindi,
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
  getAllcategoryMaster,
  getMediaById,
  createMedia,
  updateMedia,
  getAjaxMedias,
  deleteMedia,
};
