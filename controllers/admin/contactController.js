const { Op, where } = require("sequelize");
const contactFormModel = require("../../models/contactModel");

const createContact = async (req, res) => {
  try {
    const newContact = await contactFormModel.create({
      ...req.body,
    });
    res.status(201).json({
      success: true,
      message: "Record added successfully",
      data: newContact,
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

const getAjaxContact = async (req, res) => {
  const draw = parseInt(req.body.draw) || 1;
  const start = parseInt(req.body.start) || 0;
  const length = parseInt(req.body.length) || 10;
  const order = req.body.order || [];
  const searchValue = req.body.search?.value || "";

  const filteredStatus = req.query?.status || "all";
  // const filteredMobile = req.query?.mobile || "";
  // const filteredName = req.query?.name || "";
  const filteredMobile = req.query?.mobile || req.body?.mobile || "";
  const filteredName = req.query?.name || req.body?.name || "";

  const colIndex = order[0]?.column || 0;
  const dir = order[0]?.dir === "asc" ? "ASC" : "DESC";
  const columns = [
    "id",
    "name",
    "mobile",
    "email",
    "company",
    "title",
    "message",
    "status",
  ];

  const sortField = columns[colIndex] || "id";
  const whereClause = {
    is_deleted: "0",
  };

  if (searchValue) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${searchValue}%` } },
      { mobile: { [Op.like]: `%${searchValue}%` } },
      { email: { [Op.like]: `%${searchValue}%` } },
      { company: { [Op.like]: `%${searchValue}%` } },
      { title: { [Op.like]: `%${searchValue}%` } },
    ];
  }

  if (filteredStatus !== "all") {
    whereClause.status = filteredStatus;
  }

  if (filteredMobile) {
    whereClause.mobile = { [Op.like]: `%${filteredMobile}%` };
  }

  if (filteredName) {
    whereClause.name = { [Op.like]: `%${filteredName}%` };
  }

  // whereClause.is_deleted = "0";

  const total = await contactFormModel.count();
  const filtered = await contactFormModel.count({ where: whereClause });

  const docs = await contactFormModel.findAll({
    where: whereClause,
    order: [[sortField, dir]],
    offset: start,
    limit: length,
  });

  const data = docs.map((row, i) => [
    i + 1 + start,
    row.id,
    row.name,
    row.mobile,
    row.email,
    row.company,
    row.title,
    row.message,
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
  createContact,
  getAjaxContact,
};
