// mediaController.js
const mediaModel = require("../../models/mediaModel");
const mediaModuleModel = require("../../models/mediaModuleModel");
const { sequelize } = require("../../config/db");

const getMediaData = async (req, res) => {
  try {
    const { media_type } = req.query;

    // Build where condition
    const whereCondition = {
      status: "1",
      is_deleted: "0",
    };

    // Add media_type filter if provided
    if (media_type && media_type !== "All") {
      whereCondition.media_type = media_type;
    }

    // Fetch media data with categories
    const mediaData = await mediaModuleModel.findAll({
      where: whereCondition,
      include: [
        {
          model: mediaModel,
          as: "media",
          where: {
            status: "1",
            is_deleted: "0",
          },
          attributes: ["id", "media_category", "name_english", "name_hindi"],
        },
      ],
      attributes: [
        "id",
        "media_type",
        "media_category_id",
        "upload_photo",
        "upload_video",
        "descr_english",
        "descr_hindi",
      ],
      order: [["created_on", "DESC"]],
    });

    // Group data by categories
    const categoriesMap = new Map();
    const mediaItemsMap = new Map();

    mediaData.forEach((item) => {
      const categoryId = item.media_category_id;
      const categoryData = item.media;

      // Add category to map if not exists
      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          title_english: categoryData.name_english,
          title_hindi: categoryData.name_hindi,
          media_category: categoryData.media_category,
          type: item.media_type,
        });
      }

      // Add media item to map
      if (!mediaItemsMap.has(categoryId)) {
        mediaItemsMap.set(categoryId, []);
      }

      const mediaItem = {
        id: item.id,
        type: item.media_type.toLowerCase(),
        category_id: categoryId,
        category_name_english: categoryData.name_english,
        category_name_hindi: categoryData.name_hindi,
        description_english: item.descr_english,
        description_hindi: item.descr_hindi,
      };

      // Add media URLs based on type
      if (item.media_type.toLowerCase() === "photos") {
        mediaItem.src = item.upload_photo;
        mediaItem.width = 800;
        mediaItem.height = 600;
      } else if (item.media_type.toLowerCase() === "videos") {
        mediaItem.src = item.upload_video;
        mediaItem.thumb = item.upload_photo; // thumbnail
      } else if (item.media_type.toLowerCase() === "news") {
        mediaItem.src = item.upload_video; // news video URL
        mediaItem.thumb = item.upload_photo; // news thumbnail
      }

      mediaItemsMap.get(categoryId).push(mediaItem);
    });

    // Convert maps to arrays
    const categories = Array.from(categoriesMap.values());
    const mediaItems = {};
    
    mediaItemsMap.forEach((items, categoryId) => {
      mediaItems[categoryId] = items;
    });

    // Get all available media types from database (not filtered by current selection)
    const allMediaTypes = await mediaModuleModel.findAll({
      where: {
        status: "1",
        is_deleted: "0",
      },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('media_type')), 'media_type']],
      raw: true,
    });

    const mediaTypes = ["All", ...allMediaTypes.map(item => item.media_type)];

    res.status(200).json({
      success: true,
      data: {
        categories,
        mediaItems,
        tabs: mediaTypes,
      },
      message: "Media data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching media data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch media data",
      error: error.message,
    });
  }
};

// Get media by specific category
const getMediaByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const mediaData = await mediaModuleModel.findAll({
      where: {
        media_category_id: categoryId,
        status: "1",
        is_deleted: "0",
      },
      include: [
        {
          model: mediaModel,
          as: "media",
          where: {
            status: "1",
            is_deleted: "0",
          },
          attributes: ["id", "media_category", "name_english", "name_hindi"],
        },
      ],
      attributes: [
        "id",
        "media_type",
        "upload_photo",
        "upload_video",
        "descr_english",
        "descr_hindi",
      ],
      order: [["created_on", "DESC"]],
    });

    const formattedData = mediaData.map((item) => ({
      id: item.id,
      type: item.media_type.toLowerCase(),
      src: item.media_type.toLowerCase() === "photos" ? item.upload_photo : item.upload_video,
      thumb: item.upload_photo,
      width: 800,
      height: 600,
      description_english: item.descr_english,
      description_hindi: item.descr_hindi,
      category_name_english: item.media.name_english,
      category_name_hindi: item.media.name_hindi,
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
      message: "Category media data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching category media data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category media data",
      error: error.message,
    });
  }
};

module.exports = {
  getMediaData,
  getMediaByCategory,
};