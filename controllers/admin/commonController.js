const express = require("express");
const router = express.Router();

const deleteItem = async (req, res) => {
  const { model, id } = req.params;

  try {
    const dbModels = req.app.get("db").models;

    // Validate model
    if (!dbModels[model]) {
      return res.status(400).json({
        success: false,
        message: `Invalid model name '${model}'`,
        data: null,
      });
    }

    const item = await dbModels[model].findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${model} with ID ${id} not found`,
        data: null,
      });
    }

    item.is_deleted = "1";
    await item.save();

    return res.status(200).json({
      success: true,
      message: `Record deleted successfully`,
      data: null,
    });
  } catch (error) {
    console.error("DeleteItem Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Unknown error",
    });
  }
};

const activateItem = async (req, res) => {
  const { model, id } = req.params;

  try {
    const dbModels = req.app.get("db").models;

    if (!dbModels[model]) {
      return res.status(400).json({
        success: false,
        message: `Invalid model name '${model}'`,
        data: null,
      });
    }

    const item = await dbModels[model].findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${model} with ID ${id} not found`,
        data: null,
      });
    }

    item.status = "1";
    await item.save();

    return res.status(200).json({
      success: true,
      message: `Record activated successfully`,
      data: null,
    });
  } catch (error) {
    console.error("ActivateItem Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Unknown error",
    });
  }
};

const deactivateItem = async (req, res) => {
  const { model, id } = req.params;

  try {
    const dbModels = req.app.get("db").models;

    if (!dbModels[model]) {
      return res.status(400).json({
        success: false,
        message: `Invalid model name '${model}'`,
        data: null,
      });
    }

    const item = await dbModels[model].findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${model} with ID ${id} not found`,
        data: null,
      });
    }

    item.status = "0";
    await item.save();

    return res.status(200).json({
      success: true,
      message: `Record deactivated successfully`,
      data: null,
    });
  } catch (error) {
    console.error("DeactivateItem Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Unknown error",
    });
  }
};

module.exports = {
  deleteItem,
  activateItem,
  deactivateItem,
};
