const { Op, where } = require("sequelize");
const mediaModuleModel = require("../../models/mediaModuleModel");

const mediaModel = require("../../models/mediaModel");
const { Sequelize } = require("sequelize");

const getAllMediaModules = async (req, res) => {
  try {
    const mediaModules = await mediaModuleModel.findAll({
      where: {
        is_deleted: "0",
      },
    });
    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: mediaModules,
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

const getMediaModuleById = async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "en";

  try {
    const mediaModule = await mediaModuleModel.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
    });

    if (!mediaModule) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }
    const response = {
      id: mediaModule.id,
      media_type: mediaModule.media_type,
      media_category_id: mediaModule.media_category_id,
      upload_photo: mediaModule.upload_photo,
      upload_video: mediaModule.upload_video,
      descr_english: mediaModule.descr_english,
      descr_hindi: mediaModule.descr_hindi,
      status: mediaModule.status,
      is_deleted: mediaModule.is_deleted,
      created_on: mediaModule.created_on,
      updated_on: mediaModule.updated_on,
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

const createMediaModule = async (req, res) => {
  const { media_type, media_category_id } = req.body;
  try {
    const files = req.files || {};

    const existing = await mediaModuleModel.findOne({
      where: { media_type, media_category_id, is_deleted: "0" },
    });

    // if (existing) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "This category already added to selected media type",
    //     data: {},
    //   });
    // }

    const newMediaModule = await mediaModuleModel.create({
      ...req.body,
      upload_photo: req.files?.upload_photo?.[0]?.filename || null,
      upload_thumbnail: req.files?.upload_thumbnail?.[0]?.filename || null,
      upload_video: req.files?.upload_video?.[0]?.filename || null,
    });

    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: newMediaModule,
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

// const updateMediaModule = async (req, res) => {
//   const { id } = req.params;
//   const files = req.files || {};
//   try {
//     const existingMediaModule = await mediaModuleModel.findByPk(id);
//     if (!existingMediaModule) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//         data: null,
//       });
//     }
//     const updatedData = {
//       ...req.body,
//       upload_photo: req.files?.upload_photo?.[0]?.filename || null,
//       upload_video: req.files?.upload_video?.[0]?.filename || null,
//     };

//     const [updated] = await mediaModuleModel.update(updatedData, {
//       where: { id },
//     });

//     if (updated === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No changes made; data already up to date.",
//         data: null,
//       });
//     }

//     const updatedMediaModule = await mediaModuleModel.findByPk(id);

//     res.status(200).json({
//       success: true,
//       message: "Record updated successfully",
//       data: updatedMediaModule,
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating record",
//       data: null,
//       error: error.message || error,
//     });
//   }
// };

const updateMediaModule = async (req, res) => {
  const { id } = req.params;
  const files = req.files || {};

  try {
    const existingMediaModule = await mediaModuleModel.findByPk(id);
    if (!existingMediaModule) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    // Prepare update data - only include file fields if new files are uploaded
    const updatedData = {
      ...req.body,
    };

    // Only update photo if a new file was uploaded
    if (req.files?.upload_photo?.[0]?.filename) {
      updatedData.upload_photo = req.files.upload_photo[0].filename;
    }

      if (req.files?.upload_thumbnail?.[0]?.filename) {
       updatedData.upload_thumbnail = req.files.upload_thumbnail[0].filename;
    }
    // If no new photo uploaded, don't include upload_photo in update (preserves existing value)

    // Only update video if a new file was uploaded
    if (req.files?.upload_video?.[0]?.filename) {
      updatedData.upload_video = req.files.upload_video[0].filename;
    }
    // If no new video uploaded, don't include upload_video in update (preserves existing value)

    const [updated] = await mediaModuleModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const updatedMediaModule = await mediaModuleModel.findByPk(id);

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedMediaModule,
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

const deleteMediaModule = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await mediaModuleModel.destroy({
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

const getAjaxMediaModules = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";
  // const statusFilter = req.query.status || req.body.status || "all";
  const filteredUnit = req.query?.media_category_id || "all";
  const filteredType = req.query?.media_type || "all";
  const filteredCategoryName = req.query?.category_name || "";

  const columns = [
    "media_type",
    "media_category_id",
    "upload_photo",
    "upload_video",
    "name_english",
    "media_category",
    "descr_english",
    "descr_hindi",
    "status",
  ];

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "DESC" : "ASC";
  const sortField = columns[colIndex] || "id";

  const whereClause = {
    is_deleted: "0",
  };

  if (searchValue) {
    whereClause[Op.or] = [
      { media_type: { [Op.like]: `%${searchValue}%` } },
      { media_category_id: { [Op.like]: `%${searchValue}%` } },
      { upload_photo: { [Op.like]: `%${searchValue}%` } },
      { upload_video: { [Op.like]: `%${searchValue}%` } },
      { descr_english: { [Op.like]: `%${searchValue}%` } },
      { descr_hindi: { [Op.like]: `%${searchValue}%` } },
      { status: { [Op.like]: `%${searchValue}%` } },
    ];
  }

  // if (statusFilter !== "all") {
  //   whereClause.status = statusFilter;
  // }

  if (filteredUnit !== "all") {
    whereClause.media_category_id = filteredUnit;
  }

  if (filteredType !== "all") {
    whereClause.media_type = filteredType;
  }

  const total = await mediaModuleModel.count();
  const filtered = await mediaModuleModel.count({ where: whereClause });

  const docs = await mediaModuleModel.findAll({
    where: whereClause,
    order: [[sortField, dir]],
    offset: start,
    limit: length,
    include: [
      {
        model: mediaModel,
        as: "media",
        attributes: ["name_english", "media_category"],
        required: true,
        where: {
          is_deleted: "0",
          ...(filteredCategoryName && {
            [Op.or]: [
              { name_english: { [Op.like]: `%${filteredCategoryName}%` } },
              { name_hindi: { [Op.like]: `%${filteredCategoryName}%` } },
            ],
          }),
        },
      },
    ],
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.media_type,
    row.media_category_id,
    row.media?.name_english || row.name_english,
    row.media?.media_category || row.media_category,
    row.upload_photo,
    row.upload_video,
    row.descr_english,
    row.descr_hindi,
    row.status,
    row.upload_thumbnail,
  ]);

  res.json({
    draw,
    recordsTotal: total,
    recordsFiltered: filtered,
    data,
  });
};

module.exports = {
  getAllMediaModules,
  getAjaxMediaModules,
  getMediaModuleById,
  createMediaModule,
  updateMediaModule,
  deleteMediaModule,
};
