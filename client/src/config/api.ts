export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface FetchOptions extends RequestInit {
  bodyData?: any;
}

export async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (options.bodyData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Ensure session cookies are sent
  };

  if (options.bodyData) {
    config.body = JSON.stringify(options.bodyData);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}
