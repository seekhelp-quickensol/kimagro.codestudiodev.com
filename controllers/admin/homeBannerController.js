const { Op, where } = require("sequelize");
const homeBannerModel = require("../../models/homeBannerModel");

const getAllbanners = async (req, res) => {
  try {
    const banners = await homeBannerModel.findAll({
      where: {
        is_deleted: "0",
      },
    });

    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: banners,
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

const getBannerById = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await homeBannerModel.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: banner,
    });
  } catch (error) {
    console.error("Error fetching Record:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createBanner = async (req, res) => {
  try {
    const existingBanner = await homeBannerModel.findOne({
      where: { is_deleted: "0" },
    });

    const bannerData = {
      ...req.body,
    };

    if (req.file) {
      bannerData.upload_video = req.file.filename;
    }

    let response;
    if (existingBanner) {
      await homeBannerModel.update(bannerData, {
        where: { id: existingBanner.id },
      });
      const updatedBanner = await homeBannerModel.findByPk(existingBanner.id);
      response = {
        success: true,
        message: "Record updated successfully",
        data: updatedBanner,
      };
    } else {
      const newBanner = await homeBannerModel.create(bannerData);
      response = {
        success: true,
        message: "Record added successfully",
        data: newBanner,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error saving banner:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.upload_video = req.file.filename;
    }

    const [updated] = await homeBannerModel.update(updatedData, {
      where: { id },
    });

    if (updated === 0) {
      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: null,
      });
    }

    const updatedBanner = await homeBannerModel.findByPk(id);
    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedBanner,
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

const getAjaxBanners = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";
  const filteredStatus = req.query?.status || "all";

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";

  const columns = [
    "title_english",
    "title_hindi",
    "upload_video",
    "sub_title_english",
    "sub_title_hindi",
    "descr_english",
    "descr_hindi",
    "status",
  ];
  const sortField = columns[colIndex] || "id";

  const whereClause = {
    is_deleted: "0",
  };

  if (searchValue) {
    whereClause[Op.or] = [
      { title_english: { [Op.like]: `%${searchValue}%` } },
      { title_hindi: { [Op.like]: `%${searchValue}%` } },
      { sub_title_english: { [Op.like]: `%${searchValue}%` } },
      { sub_title_hindi: { [Op.like]: `%${searchValue}%` } },
      { descr_english: { [Op.like]: `%${searchValue}%` } },
      { descr_hindi: { [Op.like]: `%${searchValue}%` } },
    ];
  }

  if (filteredStatus !== "all") {
    whereClause.status = filteredStatus;
  }

  const total = await homeBannerModel.count({
    where: { is_deleted: "0" },
  });

  const filtered = await homeBannerModel.count({ where: whereClause });

  const docs = await homeBannerModel.findAll({
    where: whereClause,
    order: [[sortField, dir]],
    offset: start,
    limit: length,
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.title_english,
    row.title_hindi,
    row.sub_title_english,
    row.sub_title_hindi,
    row.descr_english,
    row.descr_hindi,
    row.upload_video,
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
  getAllbanners,
  getBannerById,
  createBanner,
  updateBanner,
  //   deleteCategory,
  getAjaxBanners,
};
