let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Auto-sanitize: Append "/api" if it is missing from the configured base URL
if (!baseUrl.endsWith("/api") && !baseUrl.endsWith("/api/")) {
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  baseUrl = `${baseUrl}/api`;
}

// Strip any trailing slash so that `${API_BASE_URL}${endpoint}` has no double slashes
if (baseUrl.endsWith("/")) {
  baseUrl = baseUrl.slice(0, -1);
}

export const API_BASE_URL = baseUrl;

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
