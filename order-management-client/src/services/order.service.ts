import { fetchApi } from "../utils/apiClient";

export const fetchOrders = async (store_id: string, page: number) => {
  const params = new URLSearchParams();
  if (store_id) params.append("store_id", store_id);
  params.append("page", page.toString());
  params.append("limit", "10");

  return fetchApi(`/orders?${params.toString()}`);
};

export const updateOrderStatus = async ({ id, status }: { id: string; status: string }) => {
  return fetchApi(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const createOrder = async (data: any) => {
  return fetchApi("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
