import { fetchApi } from "../utils/apiClient";

export const getStores = async () => {
  const data = await fetchApi("/stores");
  return data.data;
};

export const createStore = async (data: any) => {
  return fetchApi("/stores", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateStore = async ({ id, data }: { id: string; data: any }) => {
  return fetchApi(`/stores/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteStore = async (id: string) => {
  return fetchApi(`/stores/${id}`, {
    method: "DELETE",
  });
};
