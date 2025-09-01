import {
  checkDepartmentNameUnique,
  checkDesegnationNameUnique,
  checkEnCategoryNameUnique,
  checkenglishNameUnique,
  checkenglishProNameUnique,
} from "../components/services/serviceApi";
import * as Yup from "yup";
// import { ObjectSchema } from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .required("Email is required")
    .email("Enter a valid email address"),

  password: Yup.string().required("Password is required"),
  // Uncomment below for stricter password rules
  // .min(8, "Password must be at least 8 characters long")
  // .matches(/[a-z]/, "Must contain at least one lowercase letter")
  // .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  // .matches(/\d/, "Must contain at least one number")
  // .matches(/[@$!%*?&]/, "Must contain at least one special character")
});

interface CategoryFormValues {
  title_english: string;
  title_hindi: string;
  upload_img: FileList | null;
}

const categorySchema = (
  isEdit: boolean,
  currentId: string | null

): Yup.ObjectSchema<CategoryFormValues> =>
  Yup.object({
    title_english: Yup.string()
      .required("Title in english is required")
      .max(200, "Title in english cannot exceed 200 characters")
      .matches(/^[^\d]*$/, "Title in english should not contain any digits")
      .matches(
        /^[A-Za-z\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/,
        "Only english characters are allowed"
      )

      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      )
      .test(
        "unique-category-name",
        "This category name already exists",
        async function (value) {
          if (!value || value.trim().length < 2) {
            return true;
          }

          try {
            const isUnique = await checkEnCategoryNameUnique(
              value.trim(),
              currentId
            );
            return isUnique;
          } catch (error) {
            return true;
          }
        }
      ),

    title_hindi: Yup.string()
      .required("Title in hindi is required")
      .max(200, "Title in hindi cannot exceed 200 characters")
      .matches(
        /^[\u0900-\u097F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/u,
        "Only hindi characters are allowed"
      )
      .test(
        "no-digits",
        "Title in hindi should not contain any digits",
        (value) => !/[0-9\u0966-\u096F\u0A6F]/.test(value ?? "")
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    upload_img: (isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Upload image is required")
        .test(
          "fileType",
          "Only image files are allowed",
          (value): value is FileList => {
            if (!value || value.length === 0) return false;
            const file = value[0];
            return (
              file &&
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
            );
          }
        )
        .nullable()
        .transform((value) =>
          value === undefined ? null : value
        )) as Yup.Schema<FileList | null>,
  });

// 2. SKU Schema
interface SKUFormValues {
  quantity: string;
  unit: string;
}

const SKUSchema: Yup.ObjectSchema<SKUFormValues> = Yup.object({
  quantity: Yup.string().required("Quantity is required"),
  unit: Yup.string().required("Unit is required"),
});

// 3. Media Schema
interface MediaFormValues {
  media_category: string;
  name_english: string;
  name_hindi: string;
}

const mediaSchema = (current_id: string | null): Yup.ObjectSchema<MediaFormValues> => {
  return Yup.object({
  media_category: Yup.string().required("Media category is required"),

  name_english: Yup.string()
    .required("Category in english is required")
    .max(200, "Category in english cannot exceed 200 characters")
    .test(
      "no-digits",
      "Category in english should not contain any digits",
      (value) => {
        if (!value) return true;
        return !/\p{Nd}/u.test(value);
      }
    )
    .matches(/^[A-Za-z\s\-&()'",.]*$/, "Only english characters are allowed")
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    )
    .test(
      "unique-category-name",
      "This category name already exists",
      async function (value) {
        if (!value || value.trim().length < 2) {
          return true;
        }

        try {
          const isUnique = await checkenglishNameUnique(
            value.trim(),
            current_id

          );
          return isUnique;
        } catch (error) {
          return true;
        }
      }
    ),

  name_hindi: Yup.string()
    .required("Category in hindi is required")
    .max(200, "Category in hindi cannot exceed 200 characters")
    .test(
      "no-digits",
      "Category in hindi should not contain any digits",
      (value) => !value || !/[0-9\u0966-\u096F\u0A6F]/.test(value)
    )
    .matches(
      /^[\u0900-\u097F\s\-&()'",.]*$/,
      "Only hindi characters are allowed"
    )
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    ),
})
};

// 4. Banner Schema
interface BannerFormValues {
  title_english: string;
  title_hindi: string;
  sub_title_english: string;
  sub_title_hindi: string;
  descr_english: string;
  descr_hindi: string;
  upload_video: FileList | null | undefined;
}

const bannerSchema = (isEdit: boolean,

): Yup.ObjectSchema<BannerFormValues> =>
  Yup.object({
    title_english: Yup.string()
      .required("Title in hindi is required")
      .max(200, "Title in english cannot exceed 200 characters")
      .matches(/^[^\d]*$/, "Title in english should not contain any digits")
      .matches(
        /^[A-Za-z0-9!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|`~\s]+$/,
        "Only english characters are allowed"
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    title_hindi: Yup.string()
      .required("Title in hindi is required")
      .max(200, "Title in hindi cannot exceed 200 characters")
      .matches(
        /^[\u0900-\u097F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/u,
        "Only hindi characters are allowed"
      )
      .test(
        "no-digits",
        "Title in hindi should not contain any digits",
        (value) => !/[0-9\u0966-\u096F\u0A6F]/.test(value ?? "")
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    sub_title_english: Yup.string()
      .required("Sub-title in english is required")
      .max(200, "Sub title in english cannot exceed 200 characters")
      .matches(/^[^\d]*$/, "Sub title in english should not contain any digits")
      .matches(
        /^[A-Za-z0-9!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|`~\s]+$/,
        "Only english characters are allowed"
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    sub_title_hindi: Yup.string()
      .required("Sub-title in hindi is required")
      .max(100, "Sub title in hindi cannot exceed 100 characters")
      .matches(
        /^[\u0900-\u097F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/u,
        "Only hindi characters are allowed"
      )
      .test(
        "no-digits",
        "Sub title in hindi should not contain any digits",
        (value) => !/[0-9\u0966-\u096F\u0A6F]/.test(value ?? "")
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    descr_english: Yup.string()
      .required("Description in english is required")
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    descr_hindi: Yup.string()
      .required("Description in hindi is required")
      .matches(
        /^[\u0900-\u097F\u0966-\u096F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/,
        "Only Hindi characters and digits are allowed"
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    upload_video: isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Video is required")
        .test(
          "fileType",
          "Only MP4, MOV, or AVI files are allowed",
          (value: FileList | null): value is FileList => {
            if (!value || value.length === 0) return false;
            const fileType = value[0]?.type;
            return [
              "video/mp4",
              "video/quicktime",
              "video/x-msvideo",
            ].includes(fileType);
          }
        )
        .test(
          "fileSize",
          "File size must be 10 MB or less",
          (value: FileList | null): boolean => {
            if (!value || value.length === 0) return false;
            const maxSize = 10 * 1024 * 1024;
            return value[0]?.size <= maxSize;
          }
        )
        .nullable()
        .transform((value) => (value === undefined ? null : value)),
  });

// 5. Product Schema
interface ProductFormValues {
  product_category_id: string;
  product_name_english: string;
  product_name_hindi: string;
  product_tag_english?: string | null;
  product_tag_hindi?: string | null;
  product_img: FileList | null | undefined;
  product_title_english: string;
  product_title_hindi: string;
  sku_id: string[];
  // sku_id: string;
  upload_multiple_img: FileList | null | undefined;
  short_descr_english: string;
  short_descr_hindi: string;
  upload_brouch_english: FileList | null | undefined;
  upload_brouch_hindi: FileList | null | undefined;
  descr_english?: string | null;
  descr_hindi?: string | null;
}

const productSchema = (isEdit: boolean,
  currentId: string | null

): Yup.ObjectSchema<ProductFormValues> =>
  Yup.object({
    product_category_id: Yup.string().required("Product category is required"),

    product_name_english: Yup.string()
      .required("Product name in english is required")
      .max(200, "Product name in english cannot exceed 200 characters")
      .matches(
        /^[^\d]*$/,
        "Product name in english should not contain any digits"
      )
      .matches(
        /^[A-Za-z0-9!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|`~\s]+$/,
        "Only english characters are allowed"
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      )
      .test(
        "unique-product-name",
        "This product name already exists",
        async function (value) {
          if (!value || value.trim().length < 2) {
            return true;
          }

          try {
            const isUnique = await checkenglishProNameUnique(
              value.trim(),
              currentId

            );
            return isUnique;
          } catch (error) {
            return true;
          }
        }
      ),

    product_name_hindi: Yup.string()
      .required("Product name in hindi is required")
      .max(200, "Product name in hindi cannot exceed 200 characters")
      .matches(
        /^[\u0900-\u097F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/u,
        "Only hindi characters are allowed"
      )
      .test(
        "no-digits",
        "Product name in hindi should not contain any digits",
        (value) => !/[0-9\u0966-\u096F\u0A6F]/.test(value ?? "")
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    product_tag_english: Yup.string()
      .nullable()
      .transform((originalValue) => {
        if (Array.isArray(originalValue)) {
          return originalValue
            .map((tag: { value: string }) => tag.value)
            .join(",");
        }
        return originalValue;
      })
      .notRequired()

      .test(
        "max-if-present",
        "Product tag in english cannot exceed 200 characters",
        (value) => !value || value.length <= 200
      )
      .test(
        "no-digits",
        "Product tag in english should not contain any digits",
        (value) => !value || /^[^\d]*$/.test(value)
      )
      .test(
        "valid-characters",
        "Only English characters are allowed",
        (value) =>
          !value ||
          /^[A-Za-z0-9!@#$%^&*()\-_=+{}\[\]:;"'<>,.?/\\|`~\s]+$/.test(value)
      )
      .test(
        "no-leading-space",
        "First letter cannot be a space",
        (value) => !value || value[0] !== " "
      ),

    product_tag_hindi: Yup.string()
      .nullable()
      .transform((originalValue) => {
        if (Array.isArray(originalValue)) {
          return originalValue
            .map((tag: { value: string }) => tag.value)
            .join(",");
        }
        return originalValue;
      })
      .notRequired()

      .test(
        "max-if-present",
        "Product tag in hindi cannot exceed 200 characters",
        (value) => !value || value.length <= 200
      )
      .test(
        "valid-chars",
        "Only Hindi characters are allowed",
        (value) =>
          !value ||
          /^[\u0900-\u097F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/u.test(value)
      )
      .test(
        "no-digits",
        "Product tag in hindi should not contain any digits",
        (value) => !value || !/[0-9\u0966-\u096F\u0A6F]/.test(value)
      )
      .test(
        "no-leading-space",
        "First letter cannot be a space",
        (value) => !value || value[0] !== " "
      ),

    product_title_english: Yup.string()
      .required("Product title in english is required")
      .max(200, "Product title in english cannot exceed 200 characters")
      .matches(
        /^[^\d]*$/,
        "Product title in english should not contain any digits"
      )
      .matches(
        /^[A-Za-z0-9!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|`~\s]+$/,
        "Only english characters are allowed"
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    product_title_hindi: Yup.string()
      .required("Product title in hindi is required")
      .max(200, "Product title in english cannot exceed 200 characters")
      .matches(
        /^[\u0900-\u097F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/u,
        "Only hindi characters are allowed"
      )
      .test(
        "no-digits",
        "Product title in hindi should not contain any digits",
        (value) => !/[0-9\u0966-\u096F\u0A6F]/.test(value ?? "")
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      ),

    sku_id: Yup.array()
      .of(Yup.string().required())
      .min(1, "At least one SKU must be selected")
      .required("SKU is required"),

    // sku_id: Yup.string().required("SKU is required"),

    short_descr_english: Yup.string()
      .required("Short description in english is required")
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? !value.startsWith(" ") : true
      )
      .matches(
        /^[A-Za-z0-9!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|`~\s]+$/,
        "Only english characters are allowed"
      ),

    short_descr_hindi: Yup.string()
      .required("Short description in hindi is required")
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? !value.startsWith(" ") : true
      )
      .matches(
        /^[\u0900-\u097F\s!@#\$%\^&\*\(\)\-_\+=\.,\?]+$/u,
        "Only hindi characters are allowed"
      ),

    product_img: isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Product image is required")
        .test(
          "fileType",
          "Only image files are allowed",
          (value): value is FileList => {
            if (!value || value.length === 0) return false;
            const file = value[0];
            return (
              file &&
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
            );
          }
        )
        .nullable()
        .transform((value) => (value === undefined ? null : value)),

    upload_multiple_img: isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Product image is required")
        .test("fileType", "Only image files are allowed", (value) => {
          if (!value || value.length === 0) return false;
          for (let i = 0; i < value.length; i++) {
            if (
              !["image/jpeg", "image/png", "image/jpg"].includes(
                value[i].type
              )
            ) {
              return false;
            }
          }
          return true;
        })
        .nullable()
        .transform((value) => (value === undefined ? null : value)),

    upload_brouch_english: isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Brochure in english is required")
        .test(
          "fileType",
          "Only PDF, DOC, or DOCX files are allowed",
          (value) => {
            if (!value || value.length === 0) return false;
            return [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(value[0]?.type);
          }
        )
        .nullable()
        .transform((value) => (value === undefined ? null : value)),

    upload_brouch_hindi: isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Brochure in hindi is required")
        .test(
          "fileType",
          "Only PDF, DOC, or DOCX files are allowed",
          (value) => {
            if (!value || value.length === 0) return false;
            return [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(value[0]?.type);
          }
        )
        .nullable()
        .transform((value) => (value === undefined ? null : value)),
    descr_english: Yup.string().required("Description in english is required"),
    descr_hindi: Yup.string().required("Description in hindi is required"),
  });

interface innovationValues {
  upload_icon: FileList | null | undefined;
  upload_img: FileList | null | undefined;
  bio_balance_eng: string;
  bio_balance_hindi: string;
  descr_english?: string | null;
  descr_hindi?: string | null;
}
const innovationSchema = (
  isEdit: boolean,

): Yup.ObjectSchema<innovationValues> =>
  Yup.object({
    upload_icon: isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Upload icon is required")
        .test(
          "fileType",
          "Only image files are allowed",
          (value): value is FileList => {
            if (!value || value.length === 0) return false;
            const file = value[0];
            return (
              file &&
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
            );
          }
        )
        .nullable()
        .transform((value) => (value === undefined ? null : value)),
    upload_img: isEdit
      ? Yup.mixed<FileList>()
        .nullable()
        .transform((value) => (value === undefined ? null : value))
      : Yup.mixed<FileList>()
        .required("Upload image is required")
        .test(
          "fileType",
          "Only image files are allowed",
          (value): value is FileList => {
            if (!value || value.length === 0) return false;
            const file = value[0];
            return (
              file &&
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
            );
          }
        )
        .nullable()
        .transform((value) => (value === undefined ? null : value)),

    bio_balance_eng: Yup.string()
      .trim()
      .required("Short description in english is required"),

    bio_balance_hindi: Yup.string()
      .trim()
      .required("Short description in hindi is required")
      .matches(
        /^[\u0900-\u097F\u0966-\u096F\s.,:;()\[\]\-–—"'"‘’“”]+$/,
        "Only hindi characters are allowed"
      ),

    descr_english: Yup.string()
      .trim()
      .required("Description in english is required"),
    descr_hindi: Yup.string()
      .trim()
      .required("Description in hindi is required"),
  });

interface mediaModuleValues {
  media_type: string;
  media_category_id: string;
  upload_photo: FileList | null | undefined;
  upload_video: FileList | null | undefined;
  upload_thumbnail: FileList | null | undefined;
  descr_english?: string | null;
  descr_hindi?: string | null;
}

// const mediaModuleSchema: Yup.ObjectSchema<mediaModuleValues> = Yup.object({
//   media_type: Yup.string().required("Media type is required"),
//   media_category_id: Yup.string().required("Media Category is required"),

//   upload_photo: Yup.mixed<FileList>()
//     .nullable()
//     .test("fileType", "Only image files are allowed (jpeg, png, jpg)", (value) => {
//       if (!value || value.length === 0) return true;
//       return ["image/jpeg", "image/png", "image/jpg"].includes(value[0]?.type);
//     }),

//   upload_video: Yup.mixed<FileList>()
//   .nullable()
//    .test("fileType", "Only MP4, MOV, or AVI files are allowed", (value) => {
//       if (!value || value.length === 0) return true;
//       return ["video/mp4", "video/quicktime", "video/x-msvideo"].includes(value[0]?.type);
//     }),

//   descr_english: Yup.string().nullable(),
//   descr_hindi: Yup.string().nullable(),
// });

const mediaModuleSchema = (
  isEdit: boolean,

): Yup.ObjectSchema<mediaModuleValues> =>
  Yup.object({
    media_type: Yup.string().required("Media type is required"),

    media_category_id: Yup.string().required("Media category is required"),

    upload_photo: Yup.mixed<FileList>().when("media_type", {
      is: (media_type: string) =>
        (media_type === "photos" || media_type === "news") && !isEdit,
      then: (schema) =>
        schema
          .required("Photo is required")
          .test("filePresence", "Photo is required", (value) => {
            return value instanceof FileList && value.length > 0;
          })
          .test(
            "fileType",
            "Only JPEG, PNG, JPG files are allowed",
            (value) => {
              if (!value || value.length === 0) return false;
              return ["image/jpeg", "image/png", "image/jpg"].includes(
                value[0]?.type
              );
            }
          ),
      otherwise: (schema) =>
        schema
          .notRequired()
          .nullable()
          .test(
            "fileType",
            "Only JPEG, PNG, JPG files are allowed",
            (value) => {
              if (!value || value.length === 0) return true;
              return ["image/jpeg", "image/png", "image/jpg"].includes(
                value[0]?.type
              );
            }
          ),
    }),

    upload_thumbnail: Yup.mixed<FileList>().when("media_type", {
      is: (media_type: string) => media_type === "videos" && !isEdit,
      then: (schema) =>
        schema
          .required("Photo is required")
          .test("filePresence", "Photo is required", (value) => {
            return value instanceof FileList && value.length > 0;
          })
          .test(
            "fileType",
            "Only JPEG, PNG, JPG files are allowed",
            (value) => {
              if (!value || value.length === 0) return false;
              return ["image/jpeg", "image/png", "image/jpg"].includes(
                value[0]?.type
              );
            }
          ),
      otherwise: (schema) =>
        schema
          .notRequired()
          .nullable()
          .test(
            "fileType",
            "Only JPEG, PNG, JPG files are allowed",
            (value) => {
              if (!value || value.length === 0) return true;
              return ["image/jpeg", "image/png", "image/jpg"].includes(
                value[0]?.type
              );
            }
          ),
    }),

    upload_video: Yup.mixed<FileList>().when("media_type", {
      is: (media_type: string) =>
        (media_type === "videos" || media_type === "news") && !isEdit,
      then: (schema) =>
        schema
          .required("Video is required")
          .test("filePresence", "Video is required", (value) => {
            return value instanceof FileList && value.length > 0;
          })
          .test(
            "fileType",
            "Only MP4, MOV, or AVI files are allowed",
            (value) => {
              if (!value || value.length === 0) return false;
              return [
                "video/mp4",
                "video/quicktime",
                "video/x-msvideo",
              ].includes(value[0]?.type);
            }
          )
          .test("fileSize", "File size must be 10 MB or less", (value) => {
            if (!value || value.length === 0) return false;
            const maxSize = 10 * 1024 * 1024;
            return value[0]?.size <= maxSize;
          }),
      otherwise: (schema) =>
        schema
          .notRequired()
          .nullable()
          .test(
            "fileType",
            "Only MP4, MOV, or AVI files are allowed",
            (value) => {
              if (!value || value.length === 0) return true;
              return [
                "video/mp4",
                "video/quicktime",
                "video/x-msvideo",
              ].includes(value[0]?.type);
            }
          )
          .test("fileSize", "File size must be 10 MB or less", (value) => {
            if (!value || value.length === 0) return true;
            const maxSize = 10 * 1024 * 1024;
            return value[0]?.size <= maxSize;
          }),
    }),

    descr_english: Yup.string().when("media_type", {
      is: "news",
      then: (schema) => schema.required("Description in english is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

    descr_hindi: Yup.string().when("media_type", {
      is: "news",
      then: (schema) => schema.required("Description in hindi is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  });

type userValues = {
  first_name: string;
  middle_name: string;
  last_name: string;
  department_id: number;
  designation_id: number;
  email: string;
  username: string;
  password: string;
};

const userSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("First name is required")
    .matches(/^[^\d]*$/, "First name should not contain any digits")
    .matches(/^[A-Za-z\s]+$/, "Only english characters are allowed")
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    ),
  middle_name: Yup.string()
    .required("Middle name is required")
    .matches(/^[^\d]*$/, "Middle name should not contain any digits")
    .matches(/^[A-Za-z\s]+$/, "Only english characters are allowed")
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    ),
  last_name: Yup.string()
    .required("Last name is required")
    .matches(/^[^\d]*$/, "Last name should not contain any digits")
    .matches(/^[A-Za-z\s]+$/, "Only english characters are allowed")
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    ),
  department_id: Yup.number().required("Department is required"),
  designation_id: Yup.number().required("Designation is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string()
    .required("Username is required")
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    ),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test(
      "no-hindi-characters",
      "Only english characters are allowed",
      (value) => !/[\u0900-\u097F\u0966-\u096F\u0A66-\u0A6F]/.test(value ?? "")
    )
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    )
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

type departmentValues = {
  department_name: string;
};

const departmentSchema = (currentId: string | null = null) => {
  return Yup.object().shape({
    department_name: Yup.string()
      .required("Department name is required")

      .max(200, "Department name cannot exceed 200 characters")
      .test(
        "no-digits",
        "Department name should not contain any digits",
        (value) => {
          if (!value) return true;
          return !/\p{Nd}/u.test(value);
        }
      )
      .test(
        "no-special-characters",
        "Special characters are not allowed",
        (value) => {
          if (!value) return true;
          return /^[A-Za-z\u0900-\u097F\s0-9]*$/.test(value);
        }
      )
      .test(
        "only-english-letters-spaces",
        "Only english letters are allowed",
        (value) => {
          if (!value) return true;
          return /^[A-Za-z\s]*$/.test(value);
        }
      )
      .test("no-leading-space", "First letter cannot be a space", (value) =>
        value ? value[0] !== " " : true
      )
      .test(
        "unique-department-name",
        "This department name already exists",
        async function (value) {
          if (!value || value.trim().length < 2) {
            return true;
          }

          try {
            const isUnique = await checkDepartmentNameUnique(
              value.trim(),
              currentId
            );
            return isUnique;
          } catch (error) {
            return true;
          }
        }
      ),
  });
}

type designationValues = {
  designation_name: string;
};

const designationSchema = (currentId: string | null = null) => {
  return Yup.object().shape({
  designation_name: Yup.string()
    .required("Designation name is required")

    .max(200, "Designation name cannot exceed 200 characters")
    .test(
      "no-digits",
      "Designation name should not contain any digits",
      (value) => {
        if (!value) return true;
        return !/\p{Nd}/u.test(value);
      }
    )
    .test(
      "no-special-characters",
      "Special characters are not allowed",
      (value) => {
        if (!value) return true;
        return /^[A-Za-z\u0900-\u097F\s0-9]*$/.test(value);
      }
    )
    .test(
      "only-english-letters-spaces",
      "Only english letters are allowed",
      (value) => {
        if (!value) return true;
        return /^[A-Za-z\s]*$/.test(value);
      }
    )
    .test("no-leading-space", "First letter cannot be a space", (value) =>
      value ? value[0] !== " " : true
    )
    .test(
      "unique-designation-name",
      "This designation name already exists",
      async function (value) {
        if (!value || value.trim().length < 2) {
          return true;
        }

        try {
          const isUnique = await checkDesegnationNameUnique(
            value.trim(),
            currentId
          );
          return isUnique;
        } catch (error) {
          return true;
        }
      }
    ),
});
}

const contactValidationRules = {
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  mobile: Yup.string()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{10,}$/, "Invalid mobile number format")
    .required("Mobile number is required"),
  company: Yup.string().trim().required("Company name is required"),
  title: Yup.string().trim().required("Title is required"),
  message: Yup.string().trim().required("Message is required"),
};

export {
  SKUSchema,
  loginSchema,
  mediaSchema,
  bannerSchema,
  productSchema,
  innovationSchema,
  mediaModuleSchema,
  contactValidationRules,
  userSchema,
  departmentSchema,
  designationSchema,
  categorySchema,
};

export type {
  SKUFormValues,
  MediaFormValues,
  BannerFormValues,
  ProductFormValues,
  LoginFormValues,
  innovationValues,
  mediaModuleValues,
  userValues,
  departmentValues,
  designationValues,
};
