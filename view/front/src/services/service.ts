// services/service.ts
import { AxiosResponse } from "axios";
import instance from "../utils/axiosInstance";
import { data } from "jquery";
import ProductDetails from "../pages/ProductDetails";

export interface RawCategory {
  id: number;
  title_english: string;
  title_hindi: string;
  upload_img: string;
  status: string;
  is_deleted: string;
  created_on: string;
  updated_on: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: RawCategory[];
}

export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await instance.get("categories/all-categories");
  return response.data;
};




export interface Banner {
  id: number;
  title_english: string;
  title_hindi: string;
  uploadImage: string;
  sub_title_english: string;
  sub_title_hindi: string;
  descr_english: string;
  descr_hindi: string;
  upload_video: string;
}
export interface BannerResponse {
  success: boolean;
  message: string;
  data: Banner[];
}



export const getBanner = (): Promise<AxiosResponse<BannerResponse>> =>
  instance.get("/banners/banners");



export interface Innovations {
  id: number;
  product_id: number;
  upload_icon: string;
  upload_img: string;
  bio_balance_eng: string;
  bio_balance_hindi: string;
  descr_english: string;
  descr_hindi: string;
}

export interface InnovationsResponse {
  success: boolean;
  message: string;
  data: Innovations[];
}

export const getInnovations = (): Promise<AxiosResponse<InnovationsResponse>> =>
  instance.get("/innovations/innovations");


// export interface Products {
//   id: number;
//   engName: string;
//   hiName: string;
//   icon: string;
// }




// export interface ProductsByCategory {
//   categoryId: number;
//   categoryNameEnglish: string;
//   categoryNameHindi: string;
//   products: Products[] | [];

// }

// export interface ProductsByCategoryResponse {
//   success: string | boolean;
//   message: string | null;
//   data: ProductsByCategory;
// }
export interface Product {
  id: number;
  engName: string;
  hiName: string;
  icon: string;
}

export interface ProductsByCategory {
  categoryId: number;
  categoryNameEnglish: string;
  categoryNameHindi: string;
  products?: Product[];
  totalProducts?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasMore: boolean;
    productsPerPage: number;
  };
}

export interface ProductsByCategoryResponse {
  success: boolean;
  message: string;
  data: ProductsByCategory;
}


export const getProductsByCategory = (
  id: string, 
  page: number = 1, 
  limit: number = 10
): Promise<AxiosResponse<ProductsByCategoryResponse>> =>
  instance.get(`/products/by-categories/${id}?page=${page}&limit=${limit}`);

export interface ProductDetails {
  id: number;
  product_name_english: string;
  product_name_hindi: string;
  product_tag_english: string[];
  product_tag_hindi: string[];
  product_title_english:string,
  product_title_hindi:string,
  uploadImage: string;
  short_descr_english: string;
  short_descr_hindi: string;
  skus: {
    skuId: number;
    unit: string;
    quantity: number;
  }[];
  descr_hindi: string;
  descr_english: string;
  upload_brouch_hindi: string;
  upload_brouch_english: string;
  upload_multiple_img: string[];
  innovations : Innovations[];
}


export interface productDetailResponse {
  success: boolean;
  message: string;
  data: ProductDetails;
}


export const getProductDetails = (id: string): Promise<AxiosResponse<productDetailResponse>> =>
  instance.get(`/products/product-details/${id}`);


export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: any; // Adjust type as needed
}

export const submitContactForm = (
  formData: FormData
): Promise<AxiosResponse<ContactFormResponse>> =>
  instance.post("/contact/submit", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
