const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");

const getProductsByCategories = async (req, res) => {
    try {
      const categories = await categoryModel.findAll({
        where: { status: "1", is_deleted: "0" },
        attributes: ["id", "title_english", "title_hindi"],
      });
  
      const productsByCategories = await Promise.all(
        categories.map(async (category) => {
          const products = await productModel.findAll({
            where: {
              product_category_id: category.id,
              status: "1",
              is_deleted: "0",
            },
            attributes: [
              "id",
              "product_name_english",
              "product_name_hindi",
              "product_img",
            ],
          });
  
          return {
            categoryId: category.id,
            categoryNameEnglish: category.title_english,
            categoryNameHindi: category.title_hindi,
            products: products.map((product) => ({
              id: product.id,
              engName: product.product_name_english,
              hiName: product.product_name_hindi,
              icon: product.product_img,
            })),
          };
        })
      );
  
      res.status(200).json({
        success: true,
        message: "Products by categories fetched successfully",
        data: productsByCategories,
      });
    } catch (error) {
      console.error("Error fetching products by categories:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products by categories",
        data: [],
      });
    }
  };


  // const getProductsByCategoryID = async (req, res) => {
  //   try {
      
  //       const { categoryId } = req.params;
    
  //       const category = await categoryModel.findOne({
  //           where: { id: categoryId, status: "1", is_deleted: "0" },
  //           attributes: ["id", "title_english", "title_hindi"],
  //       });
    
  //       if (!category) {
  //           return res.status(404).json({
  //           success: false,
  //           message: "Category not found",
  //           data: [],
  //           });
  //       }
    
  //       const products = await productModel.findAll({
  //           where: {
  //           product_category_id: category.id,
  //           status: "1",
  //           is_deleted: "0",
  //           },
  //           attributes: [
  //           "id",
  //           "product_name_english",
  //           "product_name_hindi",
  //           "product_img",
  //           ],
  //       });
    
  //       const response = {
  //           categoryId: category.id,
  //           categoryNameEnglish: category.title_english,
  //           categoryNameHindi: category.title_hindi,
  //           products: products.map((product) => ({
  //           id: product.id,
  //           engName: product.product_name_english,
  //           hiName: product.product_name_hindi,
  //           icon: product.product_img,
  //           })),
  //       };
    
  //       res.status(200).json({
  //           success: true,
  //           message: "Products by category fetched successfully",
  //           data: response,
  //       });
  //   } catch (error) {
  //     console.error("Error fetching products by categories:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Error fetching products by categories",
  //       data: [],
  //     });
  //   }
  // };

  const getProductsByCategoryID = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      // Find category
      const category = await categoryModel.findOne({
        where: { id: categoryId, status: "1", is_deleted: "0" },
        attributes: ["id", "title_english", "title_hindi"],
      });
  
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
          data: [],
        });
      }
  
      // Get total count for pagination
      const totalProducts = await productModel.count({
        where: {
          product_category_id: category.id,
          status: "1",
          is_deleted: "0",
        },
      });
  
      // Get products with pagination
      const products = await productModel.findAll({
        where: {
          product_category_id: category.id,
          status: "1",
          is_deleted: "0",
        },
        attributes: [
          "id",
          "product_name_english",
          "product_name_hindi",
          "product_img",
        ],
        limit: limit,
        offset: offset,
        order: [["created_on", "ASC"]], // Order by Oldest first
      });
  
      const response = {
        categoryId: category.id,
        categoryNameEnglish: category.title_english,
        categoryNameHindi: category.title_hindi,
        products: products.map((product) => ({
          id: product.id,
          engName: product.product_name_english,
          hiName: product.product_name_hindi,
          icon: product.product_img,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts: totalProducts,
          hasMore: offset + products.length < totalProducts,
          productsPerPage: limit,
        },
        totalProducts: totalProducts, // For backward compatibility
      };
  
      res.status(200).json({
        success: true,
        message: "Products by category fetched successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error fetching products by categories:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products by categories",
        data: [],
      });
    }
  };


module.exports = {
    getProductsByCategories,
    getProductsByCategoryID
    
    };