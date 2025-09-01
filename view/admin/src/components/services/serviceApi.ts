import instance from "../../utils/axiosInstance";
import axios from "../../utils/axiosInstance";
import { AxiosResponse, Method } from "axios";
type FormDataType = any;
type SKUType = any;
type CategoryResponse = any;
type MediaType = any;
type BannerType = any;
type ProductType = any;

export const getCategoryById = (
  id: string
): Promise<AxiosResponse<CategoryResponse>> =>
  instance.get(`/api/categories/get-category/${id}`);

export const submitCategoryForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    url: id
      ? `/api/categories/add-category/${id}`
      : `/api/categories/add-category`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// SKU
export const getSKUById = (id: string): Promise<AxiosResponse<SKUType>> =>
  instance.get(`/api/skus/get-sku/${id}`);

export const submitSKUForm = (
  id: string | null,
  formData: FormDataType,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "application/json",
    },
    url: id ? `/api/skus/add-sku-master/${id}` : `/api/skus/add-sku-master`,
    data: formData,
  });

// Media
export const getMediaById = (id: string): Promise<AxiosResponse<MediaType>> =>
  instance.get(`/api/medias/get-media/${id}`);

export const submitMediaForm = (
  id: string | null,
  formData: FormDataType,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "application/json",
    },
    url: id
      ? `/api/medias/add-media-master/${id}`
      : `/api/medias/add-media-master`,
    data: formData,
  });

export const getAllBanners = (): Promise<AxiosResponse<BannerType[]>> =>
  axios.get("/banners");

export const submitBannerForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: id ? `/api/banners/home-banner/${id}` : `/api/banners/home-banner`,
    data: formData,
  });

export const getProdcutById = (
  id: string
): Promise<AxiosResponse<ProductType>> =>
  instance.get(`/api/products/get-product/${id}`);

type CategoryApiResponse = {
  success: boolean;
  message: string;
  data: CategoryType[];
};

type CategoryType = {
  id: number;
  title_english: string;
  title_hindi: string;
};

type SKUSType = {
  id: number;
  quantity: string;
  unit: string;
};

type SKUApiResponse = {
  success: boolean;
  message: string;
  data: SKUSType[];
};

export const getAllCategoriees = (): Promise<
  AxiosResponse<CategoryApiResponse>
> => axios.get("/api/categories/categories");

type MediaCategoryType = {
  id: number;
  name_english: string;
  media_category: string;
};

type MediaCategoryApiResponse = {
  success: boolean;
  message: string;
  data: MediaCategoryType[];
};

export const getAllMediaCategories = (): Promise<
  AxiosResponse<MediaCategoryApiResponse>
> => axios.get("/api/medias/medias");

export const getAllSKUS = (): Promise<AxiosResponse<SKUApiResponse>> =>
  axios.get("/api/skus/skus");

export const getAllSKUSOption = (): Promise<AxiosResponse<SKUApiResponse>> =>
  instance.get("/api/skus/skus");

export const getAllCategoryOption = (): Promise<
  AxiosResponse<SKUApiResponse>
> => instance.get("/api/medias/medias");

export const submitProductForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: id ? `/api/products/add-product/${id}` : `/api/products/add-product`,
    data: formData,
  });

export const getInnovationDataById = (
  id: string
): Promise<AxiosResponse<any>> =>
  instance.get(`/api/innovations/get-innovation/${id}`);

export const submitInnovationForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: id
      ? `/api/innovations/add-innovation/${id}`
      : `/api/innovations/add-innovation`,
    data: formData,
  });

export const getMediaModuleById = (
  id: string
): Promise<AxiosResponse<ProductType>> =>
  instance.get(`/api/medmodules/get-media-module/${id}`);

export const submitMediaModuleForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: id ? `/api/medmodules/add-media/${id}` : `/api/medmodules/add-media`,
    data: formData,
  });

export interface User {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  username: string;
  password?: string;
  department_id: number;
  designation_id: number;
  department?: string;
  designation?: string;
}

interface UserResponse {
  data: User;
  success: boolean;
  message: string;
}

interface UserArrayResponse {
  data: User[];
  success: boolean;
  message: string;
}

export const getUserById = (id: string): Promise<AxiosResponse<UserResponse>> =>
  instance.get(`/api/user/get-user/${id}`);

export const getBannerById = (id: string): Promise<AxiosResponse<BannerType>> =>
  instance.get(`/api/banners/get-banner/${id}`);

export const getAllUsers = (): Promise<AxiosResponse<UserArrayResponse>> =>
  instance.get("/api/user/user-list");

export const submitUserForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "application/json",
    },
    url: id ? `api/user/add-user/${id}` : `api/user/add-user`,
    data: formData,
  });

export interface Department {
  id: number;
  department_name: string;
  status: "0" | "1";
  is_deleted: "0" | "1";
  created_on: string; // or Date if you're parsing it
  updated_on: string;
}

interface DepartmentResponse {
  data: Department;
  success: boolean;
  message: string;
}
interface DepartmentArrayResponse {
  data: Department[];
  success: boolean;
  message: string;
}

export const getDepartmentById = (
  id: string
): Promise<AxiosResponse<DepartmentResponse>> =>
  instance.get(`/api/department/get-department/${id}`);

export const getAllDepartments = (): Promise<
  AxiosResponse<DepartmentArrayResponse>
> => instance.get("/api/department/department-list");

export const submitDepartmentForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<DepartmentResponse>> =>
  instance({
    method,
    headers: {
      "Content-Type": "application/json",
    },
    url: id
      ? `api/department/add-department/${id}`
      : `api/department/add-department`,
    data: formData,
  });

export interface Designation {
  id: number;
  designation_name: string;
  status: "0" | "1";
  is_deleted: "0" | "1";
  created_on: string;
  updated_on: string;
}

interface DesignationResponse {
  data: Designation;
  success: boolean;
  message: string;
}
interface DesignationArrayResponse {
  data: Designation[];
  success: boolean;
  message: string;
}

export const getDesignationById = (
  id: string
): Promise<AxiosResponse<DesignationResponse>> =>
  instance.get(`/api/designation/get-designation/${id}`);

export const getAllDesignations = (): Promise<
  AxiosResponse<DesignationArrayResponse>
> => instance.get("/api/designation/designation-list");

export const submitDesignationForm = (
  id: string | null,
  formData: FormData,
  method: Method
): Promise<AxiosResponse<any>> =>
  instance({
    method,
    headers: {
      "Content-Type": "application/json",
    },
    url: id
      ? `api/designation/add-designation/${id}`
      : `api/designation/add-designation`,
    data: formData,
  });

export const checkDepartmentNameUnique = async (
  departmentName: string,
  excludeId: string | null = null
): Promise<boolean> => {
  try {
    if (!departmentName || departmentName.trim().length === 0) {
      return true; // Empty names are handled by form validation
    }
    const params = new URLSearchParams({
      department_name: departmentName.trim(),
    });
    if (excludeId) {
      params.append("exclude_id", excludeId);
    }
    const response = await instance({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `/api/department/check-unique?${params}`,
    });

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const data = await response.data;
    return data.isUnique || false;
  } catch (error) {
    console.error("Error checking department name uniqueness:", error);
    // Return true on error to avoid blocking form submission
    return true;
  }
};

export const checkDesegnationNameUnique = async (
  designationName: string,
  excludeId: string | null = null
): Promise<boolean> => {
  try {
    if (!designationName || designationName.trim().length === 0) {
      return true; // Empty names are handled by form validation
    }
    const params = new URLSearchParams({
      designation_name: designationName.trim(),
    });
    if (excludeId) {
      params.append("exclude_id", excludeId);
    }
    const response = await instance({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `/api/designation/check-unique?${params}`,
    });

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const data = await response.data;
    return data.isUnique || false;
  } catch (error) {
    console.error("Error checking designation name uniqueness:", error);
    // Return true on error to avoid blocking form submission
    return true;
  }
};

export const checkEnCategoryNameUnique = async (
  enTitleName: string,
  excludeId: string | null = null
): Promise<boolean> => {
  try {
    if (!enTitleName || enTitleName.trim().length === 0) {
      return true; // Empty names are handled by form validation
    }
    const params = new URLSearchParams({
      title_english: enTitleName.trim(),
    });
    if (excludeId) {
      params.append("exclude_id", excludeId);
    }
    const response = await instance({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `/api/categories/check-unique?${params}`,
    });

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const data = await response.data;
    return data.isUnique || false;
  } catch (error) {
    console.error("Error checking category name uniqueness:", error);
    // Return true on error to avoid blocking form submission
    return true;
  }
};

export const checkenglishNameUnique = async (
  englishName: string,
  excludeId: string | null = null
): Promise<boolean> => {
  try {
    if (!englishName || englishName.trim().length === 0) {
      return true; // Empty names are handled by form validation
    }
    const params = new URLSearchParams({
      name_english: englishName.trim(),
    });
    if (excludeId) {
      params.append("exclude_id", excludeId);
    }
    const response = await instance({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `/api/medias/check-unique?${params}`,
    });

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const data = await response.data;
    return data.isUnique || false;
  } catch (error) {
    console.error("Error checking category name uniqueness:", error);
    // Return true on error to avoid blocking form submission
    return true;
  }
};

export const checkenglishProNameUnique = async (
  productEnName: string,
  excludeId: string | null = null
): Promise<boolean> => {
  try {
    if (!productEnName || productEnName.trim().length === 0) {
      return true; // Empty names are handled by form validation
    }
    const params = new URLSearchParams({
      product_name_english: productEnName.trim(),
    });
    if (excludeId) {
      params.append("exclude_id", excludeId);
    }
    const response = await instance({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `/api/products/check-unique?${params}`,
    });

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const data = await response.data;
    return data.isUnique || false;
  } catch (error) {
    console.error("Error checking product name uniqueness:", error);
    // Return true on error to avoid blocking form submission
    return true;
  }
};

export const checkeQuantityUnique = async (
  quantityInput: string,
  unit: string = '',
  excludeId: string | null = null
): Promise<boolean> => {
  try {
    if (!quantityInput || quantityInput.trim().length === 0) {
      return true; // Empty names are handled by form validation
    }
    const params = new URLSearchParams({
      quantity: quantityInput.trim(),
      unit: unit
    });
    if (excludeId) {
      params.append("exclude_id", excludeId);
    }
    const response = await instance({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `/api/skus/check-unique?${params}`,
    });

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const data = await response.data;
    return data.isUnique || false;
  } catch (error) {
    console.error("Error checking quantity uniqueness:", error);
    // Return true on error to avoid blocking form submission
    return true;
  }
};
