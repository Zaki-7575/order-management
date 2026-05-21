import { fetchApi } from "../utils/apiClient";

export const fetchOrdersPerDay = async (archiveType: string = 'active') => {
  const data = await fetchApi(`/analytics/orders-per-day?type=${archiveType}`);
  return data.data;
};

export const fetchRevenuePerStore = async (archiveType: string = 'active') => {
  const data = await fetchApi(`/analytics/revenue-per-store?type=${archiveType}`);
  return data.data;
};

export const fetchTopItems = async (archiveType: string = 'active') => {
  const data = await fetchApi(`/analytics/top-items?type=${archiveType}`);
  return data.data;
};

export const archiveOldOrders = async () => {
  return await fetchApi("/archive-old-orders", { method: "POST" });
};
