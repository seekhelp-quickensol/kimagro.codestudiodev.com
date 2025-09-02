const { Op, where } = require("sequelize");
const mediaModel = require("../../models/mediaModel");

const getAllcategoryMaster = async (req, res) => {
  try {
    const medias = await mediaModel.findAll({
      where: {
        is_deleted: "0",
      },
      order: [["id", "DESC"]],
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
    // const existing = await mediaModel.findOne({
    //   where: { media_category, name_english, is_deleted: "0" },
    // });

    // if (existing) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "Category in english already exists for this media type",
    //     data: {},
    //   });
    // }

    // const existingHi = await mediaModel.findOne({
    //   where: { media_category, name_hindi, is_deleted: "0" },
    // });

    // if (existingHi) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "Category in hindi already exists for this media type",
    //     data: {},
    //   });
    // }

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
      where: {
        media_category,
        name_english,
        is_deleted: "0",
        id: { [Op.ne]: id },
      },
    });

    if (existing) {
      return res.status(200).json({
        success: false,
        message: "Category in english already exists for this media type",
        data: {},
      });
    }

    const existingHi = await mediaModel.findOne({
      where: {
        media_category,
        name_hindi,
        is_deleted: "0",
        id: { [Op.ne]: id },
      },
    });

    if (existingHi) {
      return res.status(200).json({
        success: false,
        message: "Category in hindi already exists for this media type",
        data: {},
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
    order: [["id", "DESC"]],
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

const uniqueEnCategory = async (req, res) => {
  const { name_english, exclude_id } = req.query;

  try {
    // Validate required parameter
    if (!name_english || name_english.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "category name is required",
        data: {},
        isUnique: false,
      });
    }

    // Build query conditions
    const whereConditions = {
      name_english: name_english.trim(),
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

    const existing = await mediaModel.findOne({
      where: whereConditions,
    });

    if (existing) {
      return res.status(200).json({
        success: true, // Changed to true since the API call succeeded
        message: "category name already exists",
        data: {
          existingId: existing.id,
          existingName: existing.name_english,
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
  getAllcategoryMaster,
  getMediaById,
  createMedia,
  updateMedia,
  getAjaxMedias,
  deleteMedia,
  uniqueEnCategory,
};
