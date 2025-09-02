const { Op, where } = require("sequelize");
const productModel = require("../../models/productModel");
const skuModel = require("../../models/SKUModel");
const categoryModel = require("../../models/categoryModel");
const innovationModel = require("../../models/innovationModel");
const fs = require("fs");
const path = require("path");
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.findAll({
      where: {
        is_deleted: "0",
      },
    });
    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: products,
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
const capitalize = (str) =>
  typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    : str;
const getProductById = async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "en";

  try {
    const product = await productModel.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }
    const response = {
      id: product.id,
      product_category_id: product.product_category_id,
      product_name_english: product.product_name_english,
      product_name_hindi: product.product_name_hindi,
      product_tag_english: product.product_tag_english,
      product_tag_hindi: product.product_tag_hindi,
      product_img: product.product_img,
      product_title_english: product.product_title_english,
      product_title_hindi: product.product_title_hindi,
      sku_id: product.sku_id,
      upload_multiple_img: product.upload_multiple_img,
      short_descr_english: product.short_descr_english,
      short_descr_hindi: product.short_descr_hindi,
      upload_brouch_english: product.upload_brouch_english,
      upload_brouch_hindi: product.upload_brouch_hindi,
      descr_english: product.descr_english,
      descr_hindi: product.descr_hindi,
      status: product.status,
      is_deleted: product.is_deleted,
      created_on: product.created_on,
      updated_on: product.updated_on,
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

const createProudct = async (req, res) => {
  try {
    const files = req.files || {};
    const skuIds = req.body.sku_id || "";
    const newProduct = await productModel.create({
      ...req.body,
      sku_id: skuIds,

      product_img: files.product_img?.[0]?.filename || null,

      upload_brouch_english: files.upload_brouch_english?.[0]?.filename || null,
      upload_brouch_hindi: files.upload_brouch_hindi?.[0]?.filename || null,

      upload_multiple_img: files.upload_multiple_img
        ? files.upload_multiple_img.map((file) => file.filename)
        : [],
    });

    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: newProduct,
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

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const files = req.files || {};

  try {
    const existingProduct = await productModel.findByPk(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let dbImages = Array.isArray(existingProduct.upload_multiple_img)
      ? existingProduct.upload_multiple_img
      : typeof existingProduct.upload_multiple_img === "string"
        ? existingProduct.upload_multiple_img
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean)
        : [];

    let existingImages = Array.isArray(req.body.existing_multiple_images)
      ? req.body.existing_multiple_images
      : typeof req.body.existing_multiple_images === "string"
        ? req.body.existing_multiple_images
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean)
        : [];

    const deletedImages = dbImages.filter(
      (img) => !existingImages.includes(img)
    );

    deletedImages.forEach((img) => {
      const imgPath = path.join(__dirname, "../uploads/images", img);
      fs.unlink(imgPath, () => { });
    });

    const newImages = files.upload_multiple_img?.map((f) => f.filename) || [];
    const combinedImages = [...existingImages, ...newImages];

    const updatedData = {
      ...req.body,
      ...(files.product_img?.[0] && {
        product_img: files.product_img[0].filename,
      }),
      ...(files.upload_brouch_english?.[0] && {
        upload_brouch_english: files.upload_brouch_english[0].filename,
      }),
      ...(files.upload_brouch_hindi?.[0] && {
        upload_brouch_hindi: files.upload_brouch_hindi[0].filename,
      }),
      upload_multiple_img: combinedImages.join(","),
    };

    await productModel.update(updatedData, {
      where: { id },
    });

    const updatedSKU = await productModel.findByPk(id);
    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedSKU,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating record",
      data: null,
      error,
    });
  }
};

// const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const files = req.files || {};

//   try {
//     const existingProduct = await productModel.findByPk(id);

//     if (!existingProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // Get existing image names from frontend
//     let existingImages = req.body.existing_multiple_images || [];

//     if (typeof existingImages === "string") {
//       existingImages = existingImages
//         .split(",")
//         .map((img) => img.trim())
//         .filter(Boolean);
//     }

//     // Get newly uploaded image filenames
//     const newImages = files.upload_multiple_img?.map((f) => f.filename) || [];

//     // Final array is what the frontend intends to keep + newly uploaded
//     const combinedImages = [...existingImages, ...newImages];

//     const updatedData = {
//       ...req.body,
//       ...(files.product_img?.[0] && {
//         product_img: files.product_img[0].filename,
//       }),
//       ...(files.upload_brouch_english?.[0] && {
//         upload_brouch_english: files.upload_brouch_english[0].filename,
//       }),
//       ...(files.upload_brouch_hindi?.[0] && {
//         upload_brouch_hindi: files.upload_brouch_hindi[0].filename,
//       }),
//       upload_multiple_img: combinedImages,
//     };

//     const [updated] = await productModel.update(updatedData, {
//       where: { id },
//     });

//     if (updated === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "Record updated successfully",
//         data: null,
//       });
//     }

//     const updatedProduct = await productModel.findByPk(id);
//     res.status(200).json({
//       success: true,
//       message: "Record updated successfully",
//       data: updatedProduct,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating record",
//       data: null,
//       error,
//     });
//   }
// };

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await productModel.destroy({
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

// const getAjaxproducts = async (req, res) => {
//   const draw = parseInt(req.body.draw) || 1;
//   const start = parseInt(req.body.start) || 0;
//   const length = parseInt(req.body.length) || 10;
//   const order = req.body.order || [];
//   const searchValue = req.body.search?.value || "";
//   const filteredUnit = req.query?.sku_unit || "all";
//   const filterdProductName = req.query?.product_name || "";

//   const columns = [
//     "product_category_id",
//     "product_name_english",
//     "product_name_hindi",
//     "product_tag_english",
//     "product_tag_hindi",
//     "product_img",
//     "product_title_english",
//     "product_title_hindi",
//     "sku_id",
//     "quantity",
//     "unit",
//     "short_descr_english",
//     "short_descr_hindi",
//     "upload_brouch_english",
//     "upload_brouch_hindi",
//     "status",
//   ];

//   const colIndex = order[0]?.column || 0;
//   const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
//   const sortField = columns[colIndex] || "id";

//   const whereClause = {
//     is_deleted: "0",
//   };

//   if (searchValue) {
//     whereClause[Op.or] = [
//       { product_name_english: { [Op.like]: `%${searchValue}%` } },
//       { product_name_hindi: { [Op.like]: `%${searchValue}%` } },
//       { product_tag_english: { [Op.like]: `%${searchValue}%` } },
//       { product_tag_hindi: { [Op.like]: `%${searchValue}%` } },
//       { product_title_english: { [Op.like]: `%${searchValue}%` } },
//       { product_title_hindi: { [Op.like]: `%${searchValue}%` } },
//       { short_descr_english: { [Op.like]: `%${searchValue}%` } },
//       { short_descr_hindi: { [Op.like]: `%${searchValue}%` } },
//       { status: { [Op.like]: `%${searchValue}%` } },
//     ];
//   }

//   if (filteredUnit !== "all") {
//     whereClause.sku_id = filteredUnit;
//   }

//   if (filterdProductName !== "") {
//     whereClause[Op.or] = [
//       { product_name_english: { [Op.like]: `%${filterdProductName}%` } },
//       { product_name_hindi: { [Op.like]: `%${filterdProductName}%` } },
//     ];
//   }

//   const total = await productModel.count({ where: { is_deleted: "0" } });
//   const filtered = await productModel.count({ where: whereClause });

//   const docs = await productModel.findAll({
//     where: whereClause,
//     order: [["id", "DESC"]],
//     offset: start,
//     limit: length,
//   });

//   const data = await Promise.all(
//     docs.map(async (row, i) => {
//       const skuIds = Array.isArray(row.sku_id)
//         ? row.sku_id.filter(Boolean)
//         : [];

//       let skuDetails = "-";
//       if (skuIds.length > 0) {
//         const skus = await skuModel.findAll({
//           where: { id: { [Op.in]: skuIds } },
//           attributes: ["id", "quantity", "unit"],
//         });

//         skuDetails = skus
//           .map((sku) => `${sku.quantity} ${sku.unit}`)
//           .join(", ");
//       }

//       return [
//         i + 1 + start,
//         row.id,
//         row.product_category_id,
//         row.product_name_english,
//         row.product_name_hindi,
//         row.product_img,
//         row.product_title_english,
//         row.product_title_hindi,
//         row.sku_id,
//         skuDetails,
//         "",
//         row.upload_multiple_img,
//         row.short_descr_english,
//         row.short_descr_hindi,
//         row.upload_brouch_english,
//         row.upload_brouch_hindi,
//         row.descr_english,
//         row.descr_hindi,
//         row.status,
//         row.product_tag_english,
//         row.product_tag_hindi,
//       ];
//     })
//   );

//   res.json({
//     draw,
//     recordsTotal: total,
//     recordsFiltered: filtered,
//     data,
//   });
// };
// const getAjaxproducts = async (req, res) => {
//   const draw = parseInt(req.body.draw) || 1;
//   const start = parseInt(req.body.start) || 0;
//   const length = parseInt(req.body.length) || 10;
//   const order = req.body.order || [];
//   const searchValue = req.body.search?.value || "";

//   // FIX 1: Changed from 'unit' to 'sku_unit' to match your URL parameter
//   const filteredUnit = req.query?.sku_unit || "all";

//   // Step 1: If unit filter is applied, get matching SKU IDs
//   let matchingSkuIds = null;
//   if (filteredUnit !== "all") {
//     const matchingSkus = await skuModel.findAll({
//       where: { unit: filteredUnit },
//       attributes: ["id"],
//     });

//     matchingSkuIds = matchingSkus.map((sku) => sku.id);

//     // FIX 2: Check if no matching SKUs found
//     if (matchingSkuIds.length === 0) {
//       // Return empty result if no SKUs match the unit filter
//       return res.json({
//         draw,
//         recordsTotal: 0,
//         recordsFiltered: 0,
//         data: [],
//       });
//     }
//   }

//   const filterdProductName = req.query?.product_name || "";

//   const columns = [
//     "product_category_id",
//     "product_name_english",
//     "product_name_hindi",
//     "product_tag_english",
//     "product_tag_hindi",
//     "product_img",
//     "product_title_english",
//     "product_title_hindi",
//     "sku_id",
//     "quantity",
//     "unit",
//     "short_descr_english",
//     "short_descr_hindi",
//     "upload_brouch_english",
//     "upload_brouch_hindi",
//     "status",
//   ];

//   const colIndex = order[0]?.column || 0;
//   const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
//   const sortField = columns[colIndex] || "id";

//   const whereClause = {
//     is_deleted: "0",
//   };

//   const orConditions = [];

//   if (searchValue) {
//     orConditions.push(
//       { product_name_english: { [Op.like]: `%${searchValue}%` } },
//       { product_name_hindi: { [Op.like]: `%${searchValue}%` } },
//       { product_tag_english: { [Op.like]: `%${searchValue}%` } },
//       { product_tag_hindi: { [Op.like]: `%${searchValue}%` } },
//       { product_title_english: { [Op.like]: `%${searchValue}%` } },
//       { product_title_hindi: { [Op.like]: `%${searchValue}%` } },
//       { short_descr_english: { [Op.like]: `%${searchValue}%` } },
//       { short_descr_hindi: { [Op.like]: `%${searchValue}%` } },
//       { status: { [Op.like]: `%${searchValue}%` } }
//     );
//   }

//   if (filterdProductName) {
//     orConditions.push(
//       { product_name_english: { [Op.like]: `%${filterdProductName}%` } },
//       { product_name_hindi: { [Op.like]: `%${filterdProductName}%` } }
//     );
//   }

//   // FIX 3: Separate handling of OR conditions and SKU filter
//   if (orConditions.length > 0) {
//     whereClause[Op.or] = orConditions;
//   }

//   // FIX 4: Handle SKU unit filter separately using AND logic
//   if (filteredUnit !== "all" && matchingSkuIds && matchingSkuIds.length > 0) {
//     // Check if sku_id is stored as JSON array or comma-separated string
//     const skuConditions = matchingSkuIds.map((id) => ({
//       sku_id: { [Op.like]: `%${id}%` }
//     }));

//     // If there are existing OR conditions, we need to combine them properly
//     if (whereClause[Op.or]) {
//       // Apply SKU filter as AND condition with existing OR conditions
//       whereClause[Op.and] = [
//         { [Op.or]: whereClause[Op.or] },
//         { [Op.or]: skuConditions }
//       ];
//       delete whereClause[Op.or];
//     } else {
//       // Only SKU filter, use OR for multiple SKU IDs
//       whereClause[Op.or] = skuConditions;
//     }
//   }

//   try {
//     const total = await productModel.count({ where: { is_deleted: "0" } });
//     const filtered = await productModel.count({ where: whereClause });

//     const docs = await productModel.findAll({
//       where: whereClause,
//       order: [["id", "DESC"]], // FIX 5: You weren't using the sortField variable
//       offset: start,
//       limit: length,
//     });

//     const data = await Promise.all(
//       docs.map(async (row, i) => {
//         // FIX 6: Better handling of sku_id parsing
//         let skuIds = [];
//         if (row.sku_id) {
//           if (Array.isArray(row.sku_id)) {
//             skuIds = row.sku_id.filter(Boolean);
//           } else if (typeof row.sku_id === 'string') {
//             try {
//               // Try to parse as JSON array
//               skuIds = JSON.parse(row.sku_id).filter(Boolean);
//             } catch (e) {
//               // If not JSON, try comma-separated
//               skuIds = row.sku_id.split(',').map(id => id.trim()).filter(Boolean);
//             }
//           }
//         }

//         let skuDetails = "-";
//         if (skuIds.length > 0) {
//           const skus = await skuModel.findAll({
//             where: { id: { [Op.in]: skuIds } },
//             attributes: ["id", "quantity", "unit"],
//           });

//           skuDetails = skus
//             .map((sku) => `${sku.quantity} ${sku.unit}`)
//             .join(", ");
//         }

//         return [
//           i + 1 + start,
//           row.id,
//           row.product_category_id,
//           row.product_name_english,
//           row.product_name_hindi,
//           row.product_img,
//           row.product_title_english,
//           row.product_title_hindi,
//           row.sku_id,
//           skuDetails,
//           "",
//           row.upload_multiple_img,
//           row.short_descr_english,
//           row.short_descr_hindi,
//           row.upload_brouch_english,
//           row.upload_brouch_hindi,
//           row.descr_english,
//           row.descr_hindi,
//           row.status,
//           row.product_tag_english,
//           row.product_tag_hindi,
//         ];
//       })
//     );

//     res.json({
//       draw,
//       recordsTotal: total,
//       recordsFiltered: filtered,
//       data,
//     });
//   } catch (error) {
//     console.error('Error in getAjaxproducts:', error);
//     res.status(500).json({
//       draw,
//       recordsTotal: 0,
//       recordsFiltered: 0,
//       data: [],
//       error: 'Internal server error'
//     });
//   }
// };


const getAjaxproducts = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";

  // FIX 1: Changed from 'unit' to 'sku_unit' to match your URL parameter
  const filteredUnit = req.query?.sku_unit || "all";

  // Step 1: If unit filter is applied, get matching SKU IDs
  let matchingSkuIds = null;
  if (filteredUnit !== "all") {
    const matchingSkus = await skuModel.findAll({
      where: { unit: filteredUnit },
      attributes: ["id"],
    });

    matchingSkuIds = matchingSkus.map((sku) => sku.id);

    // FIX 2: Check if no matching SKUs found
    if (matchingSkuIds.length === 0) {
      // Return empty result if no SKUs match the unit filter
      return res.json({
        draw,
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
      });
    }
  }

  const filterdProductName = req.query?.product_name || "";

  const columns = [
    "product_category_id",
    "product_name_english",
    "product_name_hindi",
    "product_tag_english",
    "product_tag_hindi",
    "product_img",
    "product_title_english",
    "product_title_hindi",
    "sku_id",
    "quantity",
    "unit",
    "short_descr_english",
    "short_descr_hindi",
    "upload_brouch_english",
    "upload_brouch_hindi",
    "status",
  ];

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
  const sortField = columns[colIndex] || "id";

  const whereClause = {
    is_deleted: "0",
  };

  const orConditions = [];

  if (searchValue) {
    orConditions.push(
      { product_name_english: { [Op.like]: `%${searchValue}%` } },
      { product_name_hindi: { [Op.like]: `%${searchValue}%` } },
      { product_tag_english: { [Op.like]: `%${searchValue}%` } },
      { product_tag_hindi: { [Op.like]: `%${searchValue}%` } },
      { product_title_english: { [Op.like]: `%${searchValue}%` } },
      { product_title_hindi: { [Op.like]: `%${searchValue}%` } },
      { short_descr_english: { [Op.like]: `%${searchValue}%` } },
      { short_descr_hindi: { [Op.like]: `%${searchValue}%` } },
      { status: { [Op.like]: `%${searchValue}%` } }
    );
  }

  if (filterdProductName) {
    orConditions.push(
      { product_name_english: { [Op.like]: `%${filterdProductName}%` } },
      { product_name_hindi: { [Op.like]: `%${filterdProductName}%` } }
    );
  }

  // FIX 3: Separate handling of OR conditions and SKU filter
  if (orConditions.length > 0) {
    whereClause[Op.or] = orConditions;
  }

  // FIX 4: Handle SKU unit filter separately using AND logic
  if (filteredUnit !== "all" && matchingSkuIds && matchingSkuIds.length > 0) {
    // Check if sku_id is stored as JSON array or comma-separated string
    const skuConditions = matchingSkuIds.map((id) => ({
      sku_id: { [Op.like]: `%${id}%` }
    }));

    // If there are existing OR conditions, we need to combine them properly
    if (whereClause[Op.or]) {
      // Apply SKU filter as AND condition with existing OR conditions
      whereClause[Op.and] = [
        { [Op.or]: whereClause[Op.or] },
        { [Op.or]: skuConditions }
      ];
      delete whereClause[Op.or];
    } else {
      // Only SKU filter, use OR for multiple SKU IDs
      whereClause[Op.or] = skuConditions;
    }
  }

  try {
    const total = await productModel.count({ where: { is_deleted: "0" } });
    const filtered = await productModel.count({ where: whereClause });

    const docs = await productModel.findAll({
      where: whereClause,
      include: [
        {
          model: categoryModel,
          as: "category",
          attributes: ["title_english", "title_hindi"],
        },
      ],
      order: [["id", "DESC"]], // FIX 5: You weren't using the sortField variable
      offset: start,
      limit: length,
    });

    const data = await Promise.all(
      docs.map(async (row, i) => {
        // FIX 6: Better handling of sku_id parsing
        let skuIds = [];
        if (row.sku_id) {
          if (Array.isArray(row.sku_id)) {
            skuIds = row.sku_id.filter(Boolean);
          } else if (typeof row.sku_id === 'string') {
            try {
              // Try to parse as JSON array
              skuIds = JSON.parse(row.sku_id).filter(Boolean);
            } catch (e) {
              // If not JSON, try comma-separated
              skuIds = row.sku_id.split(',').map(id => id.trim()).filter(Boolean);
            }
          }
        }

        let skuDetails = "-";
        if (skuIds.length > 0) {
          const skus = await skuModel.findAll({
            where: { id: { [Op.in]: skuIds } },
            attributes: ["id", "quantity", "unit"],
          });

          skuDetails = skus
            .map((sku) => `${sku.quantity} ${capitalize(sku.unit)}`)
            .join(", ");
        }

        return [
          i + 1 + start,
          row.id,
          row.product_category_id,

          row.product_name_english,
          row.product_name_hindi,
          row.product_img,
          row.product_title_english,
          row.product_title_hindi,
          row.sku_id,
          skuDetails,
          "",
          row.upload_multiple_img,
          row.short_descr_english,
          row.short_descr_hindi,
          row.upload_brouch_english,
          row.upload_brouch_hindi,
          row.descr_english,
          row.descr_hindi,
          row.status,
          row.product_tag_english,
          row.product_tag_hindi,
          row.category?.title_english || "-",
          row.category?.title_hindi || "-",
        ];
      })
    );

    res.json({
      draw,
      recordsTotal: total,
      recordsFiltered: filtered,
      data,
    });
  } catch (error) {
    console.error('Error in getAjaxproducts:', error);
    res.status(500).json({
      draw,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: [],
      error: 'Internal server error'
    });
  }
};

const getProductDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findOne({
      where: {
        id,
        is_deleted: "0",
        // status: "1",
      },
      include: [
        {
          model: skuModel,
          as: "sku",
          attributes: ["quantity", "unit"],
        },
        {
          model: categoryModel,
          as: "category",
          attributes: ["title_english", "title_hindi"],
        },
        {
          model: innovationModel,
          as: "innovations",
          where: {
            is_deleted: "0", // Only fetch non-deleted innovations
            status: "1", // Only fetch active innovations (optional, adjust as needed)
          },
          attributes: [
            "id",
            "upload_icon",
            "upload_img",
            "bio_balance_eng",
            "bio_balance_hindi",
            "descr_english",
            "descr_hindi",
          ],
          required: false, // Set to false to return product even if no innovations exist
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const skuIds = Array.isArray(product.sku_id)
      ? product.sku_id.map((id) => parseInt(id.trim()))
      : [];
    let skus = [];
    if (skuIds.length > 0) {
      skus = await skuModel.findAll({
        where: {
          id: {
            [Op.in]: skuIds,
          },
        },
        attributes: ["id", "quantity", "unit"],
      });
    }

    // Add skus to the product object
    product.dataValues.skus = skus;

    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const uniqueEnProduct = async (req, res) => {
  const { product_name_english, exclude_id } = req.query;
  const { selectedCategoryId } = req.query;


  try {
    if (!product_name_english || product_name_english.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "product name is required",
        data: {},
        isUnique: false,
      });
    }

    const whereConditions = {
      product_name_english: product_name_english.trim(),
      is_deleted: "0",
    };

    if (selectedCategoryId) {
      whereConditions.product_category_id = selectedCategoryId;
    }

    if (exclude_id) {
      whereConditions.id = {
        [Op.ne]: exclude_id,
      };
    }

    const existing = await productModel.findOne({
      where: whereConditions,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "product name already exists",
        data: {
          existingId: existing.id,
          existingName: existing.product_name_english,
        },
        isUnique: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product name is available",
      data: {},
      isUnique: true,
    });
  } catch (error) {
    // console.error("Error checking product uniqueness:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: {
        error: error.message || error,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      isUnique: false,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProudct,
  updateProduct,
  deleteProduct,
  getAjaxproducts,
  getProductDetails,
  uniqueEnProduct,
};
