const { body, validationResult } = require("express-validator");

const userValidationRules = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
   

  body("middle_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
    

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
   

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  

  body("department_id")
    .notEmpty()
    .withMessage("Department is required")
    .isNumeric()
    .withMessage("Department must be a number"),
  body("designation_id")
    .notEmpty()
    .withMessage("Designation is required")
    .isNumeric()
    .withMessage("Designation must be a number"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
  // .isLength({ min: 8 })
  // .withMessage("Password must be at least 8 characters long")
  // .matches(/[a-z]/)
  // .withMessage("Password must contain at least one lowercase letter")
  // .matches(/[A-Z]/)
  // .withMessage("Password must contain at least one uppercase letter")
  // .matches(/\d/)
  // .withMessage("Password must contain at least one number")
  // .matches(/[@$!%*?&]/)
  // .withMessage("Password must contain at least one special character"),
];

const categoryValidationRules = [
  body("title_english")
    .trim()
    .notEmpty()
    .withMessage("Title in english is required")
    .isLength({ max: 200 })
    .withMessage("Title in english must be 200 characters"),

  body("title_hindi")
    .trim()
    .notEmpty()
    .withMessage("Title in hindi is required")
    .isLength({ max: 200 })
    .withMessage("Title in hindi must be 200 characters")
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only hindi characters, digits are allowed"),

  body("upload_img")
    .optional()
    .isString()
    .withMessage("Upload image must be a string"),
];

const skuValidationRules = [
  body("quantity").trim().notEmpty().withMessage("Quantity is required"),
  body("unit").trim().notEmpty().withMessage("Unit is required"),
];

const mediaMasterValidationRules = [
  body("media_category").notEmpty().withMessage("Media category is required"),

  body("name_english")
    .trim()
    .notEmpty()
    .withMessage("Name in english is required")
    .isLength({  max: 200 })
    .withMessage("Name in english must 200 characters"),

  body("name_hindi")
    .trim()
    .notEmpty()
    .withMessage("Name in hindi is required")
    .isLength({  max: 200 })
    .withMessage("Name in hindi must be 200 characters")
    .matches(
      /^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?\"\'\(\)]+$/
    )
    .withMessage("Only hindi characters, digits are allowed"),
];

const bannerValidationRules = [
  body("title_english")
    .trim()
    .notEmpty()
    .withMessage("Title in english is required")
    .isLength({  max: 200 })
    .withMessage("Title in english must be  200 characters"),

  body("title_hindi")
    .trim()
    .notEmpty()
    .withMessage("Title in hindi is required")
    .isLength({  max: 200 })
    .withMessage("Title in hindi must  200 characters")
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only Hindi characters and digits are allowed"),

  // body("upload_video")
  //   .notEmpty()
  //   .withMessage("Video file is required"),

  body("sub_title_english")
    .trim()
    .notEmpty()
    .withMessage("Sub-title in english is required")
    .isLength({  max: 200 })
    .withMessage("Sub-title in english must  200 characters"),

  body("sub_title_hindi")
    .trim()
    .notEmpty()
    .withMessage("Sub-title in hindi is required")
    .isLength({  max: 200 })
    .withMessage("Sub-title in hindi must  200 characters")
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only Hindi characters and digits are allowed"),

  body("descr_english")
    .trim()
    .notEmpty()
    .withMessage("Description in english is required")
    .isLength({  max: 1000 })
    .withMessage("Description in english must  1000 characters"),

  body("descr_hindi")
    .trim()
    .notEmpty()
    .withMessage("Description in hindi is required")
    .isLength({ max: 1000 })
    .withMessage("Description in hindi must be  1000 characters")
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only Hindi characters and digits are allowed"),
];

const productValidationRules = [
  body("product_category_id")
    .notEmpty()
    .withMessage("Product category is required"),

  body("product_name_english")
    .trim()
    .notEmpty()
    .withMessage("Product name in english is required")
    .isLength({  max: 200 })
    .withMessage(
      "Product name in english must be 200 characters"
    ),
  body("product_name_hindi")
    .trim()
    .notEmpty()
    .withMessage("Product name in hindi is required")
    .isLength({ max: 200 })
    .withMessage("Product name in hindi must be between 2 and 200 characters")
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only hindi characters, digits are allowed"),

  body("product_img")
    .optional()
    .isString()
    .withMessage("Product image is required"),

  body("upload_multiple_img")
    .optional()
    .isString()
    .withMessage("Product Multiple image is required"),

  body("upload_brouch_english")
    .optional()
    .isString()
    .withMessage("Brouchure in english is required"),

  body("upload_brouch_hindi")
    .optional()
    .isString()
    .withMessage("Brouchure in hindi is required"),

  body("product_title_english")
    .trim()
    .notEmpty()
    .withMessage("Product title in english is required")
    .isLength({ max: 200 })
    .withMessage(
      "Product title in english must be 200 characters"
    ),

  body("product_title_hindi")
    .trim()
    .notEmpty()
    .withMessage("Product title in hindi is required")
    .isLength({  max: 200 })
    .withMessage("Product title in hindi must be 200 characters")
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only hindi characters, digits are allowed"),

  body("sku_id").notEmpty().withMessage("SKU is required"),

  body("short_descr_english")
    .trim()
    .notEmpty()
    .withMessage("Short description in english is required")
    .isLength({  max: 1000 })
    .withMessage(
      "Short description in english must be 1000 characters"
    ),

  body("short_descr_hindi")
    .trim()
    .notEmpty()
    .withMessage("Short description in hindi is required")
    .isLength({  max: 1000 })
    .withMessage(
      "Short description in hindi must be 1000 characters"
    )
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only hindi characters, digits are allowed"),

  body("descr_english")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Description in english must be maximum 2000 characters"),

  body("descr_hindi")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Description in Hindi must be maximum 2000 characters"),
];

const innovationValidationRules = [
  body("upload_icon")
    .optional()
    .isString()
    .withMessage("Upload iconn is required"),

  body("upload_img")
    .optional()
    .isString()
    .withMessage("Upload image is required"),

  body("bio_balance_eng")
    .trim()
    .notEmpty()
    .withMessage("Bio balance in english is required")
    .isLength({ max: 2000 })
    .withMessage(
      "Bio balanace in english must be 2000 characters"
    ),

  body("bio_balance_hindi")
    .trim()
    .notEmpty()
    .withMessage("Bio balanace in hindi is required")
    .isLength({  max: 2000 })
    .withMessage("Bio balanace in hindi must be 2000 characters")
    .matches(/^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/)
    .withMessage("Only hindi characters, digits are allowed"),

  body("descr_english")
    .optional()
    .isString()
    .isLength({ max: 2000})
    .withMessage("Description in english must be 2000 characters"),

  body("descr_hindi")
    .optional()
    .isString()
    .isLength({ min: 1})
    .withMessage("Description in Hindi must be at least 1 characters"),
];

const mediaModuleValidationRules = [
  body("media_type").trim().notEmpty().withMessage("Media type is required"),
  body("media_category_id")
    .trim()
    .notEmpty()
    .withMessage("Media Category is required"),

  // body("upload_photo").custom((value, { req }) => {
  //   if (
  //     !req.files ||
  //     !req.files.upload_photo ||
  //     req.files.upload_photo.length === 0
  //   ) {
  //     throw new Error("Upload photo is required");
  //   }
  //   return true;
  // }),

  // body("descr_english")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Description in english is required")
  //   .isLength({ min: 2, max: 100 })
  //   .withMessage("Description in english must be between 2 and 100 characters"),

  // body("descr_hindi")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Description in hindi is required")
  //   .isLength({ min: 2, max: 100 })
  //   .withMessage("Description in hindi must be between 2 and 100 characters"),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  next();
};

const departmentValidationRules = [
  body("department_name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required"),
];

const designationValidationRules = [
  body("designation_name")
    .trim()
    .notEmpty()
    .withMessage("Designation name is required"),
];

const contactValiationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
   

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isNumeric()
    .withMessage("Mobile number must be numeric"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("company").trim().notEmpty().withMessage("Company name is required"),

  body("title").trim().notEmpty().withMessage("Title is required"),

  body("message").trim().notEmpty().withMessage("Message is required"),
];

module.exports = {
  userValidationRules,
  bannerValidationRules,
  innovationValidationRules,
  validateId,
  validateRequest,
  skuValidationRules,
  categoryValidationRules,
  mediaMasterValidationRules,
  productValidationRules,
  mediaModuleValidationRules,
  departmentValidationRules,
  designationValidationRules,
  contactValiationRules,
};
