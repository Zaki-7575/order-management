import { fetchApi } from "../utils/apiClient";

export const getItems = async () => {
  const data = await fetchApi("/items");
  return data.data;
};

export const createItem = async (data: any) => {
  return fetchApi("/items", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateItem = async ({ id, data }: { id: string; data: any }) => {
  return fetchApi(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteItem = async (id: string) => {
  return fetchApi(`/items/${id}`, {
    method: "DELETE",
  });
};
