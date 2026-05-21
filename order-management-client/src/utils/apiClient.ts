import { handleApiResponse } from "./apiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * A centralized wrapper for the native fetch API.
 * Automatically prepends the base URL and formats default headers.
 */
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // If body is FormData, remove Content-Type so browser sets it with boundary
  if (options.body instanceof FormData) {
    if (config.headers && "Content-Type" in config.headers) {
      delete (config.headers as Record<string, string>)["Content-Type"];
    }
  }

  const response = await fetch(url, config);
  return handleApiResponse(response, "An API error occurred");
};
