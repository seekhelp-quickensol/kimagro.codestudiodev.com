const { Op } = require('sequelize');
const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');

exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters long' });
    }

    const searchQuery = `%${query.trim()}%`;

    // Search categories
    const categories = await categoryModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { title_english: { [Op.like]: searchQuery } },
              { title_hindi: { [Op.like]: searchQuery } },
            ],
          },
          { status: '1' },
          { is_deleted: '0' },
        ],
      },
      attributes: ['id', 'title_english', 'title_hindi', 'upload_img'],
    });

    // Search products
    const products = await productModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { product_name_english: { [Op.like]: searchQuery } },
              { product_name_hindi: { [Op.like]: searchQuery } },
              { product_title_english: { [Op.like]: searchQuery } },
              { product_title_hindi: { [Op.like]: searchQuery } },
            ],
          },
          { status: '1' },
          { is_deleted: '0' },
        ],
      },
      attributes: [
        'id',
        'product_name_english',
        'product_name_hindi',
        'product_title_english',
        'product_title_hindi',
        'product_img',
      ],
      include: [
        {
          model: categoryModel,
          as: 'category',
          attributes: ['id', 'title_english', 'title_hindi'],
          where: { status: '1', is_deleted: '0' },
        },
      ],
    });

    res.status(200).json({
      categories,
      products,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};