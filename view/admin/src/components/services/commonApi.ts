// import instance from "../../utils/axiosInstance";

// export const deleteItem = (model, id) =>{
//   return instance.delete(`/api/delete/${model}/${id}`);
// }

// export const activateItem = (model, id) =>{
//   return instance.put(`/api/active/${model}/${id}`);
// }

// export const deactivateItem = (model, id) =>{
//   return instance.put(`/api/inactive/${model}/${id}`);
// }

import instance from "../../utils/axiosInstance";
import { AxiosResponse } from "axios";

// Define reusable types
type ModelName = string | number;
type ItemId = string | number;

// DELETE
export const deleteItem = (model: ModelName, id: ItemId): Promise<AxiosResponse> => {
  return instance.delete(`/api/delete/${model}/${id}`);
};

// ACTIVATE
export const activateItem = (model: ModelName, id: ItemId): Promise<AxiosResponse> => {
  return instance.put(`/api/active/${model}/${id}`);
};

// DEACTIVATE
export const deactivateItem = (model: ModelName, id: ItemId): Promise<AxiosResponse> => {
  return instance.put(`/api/inactive/${model}/${id}`);
};