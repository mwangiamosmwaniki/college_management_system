/**
 * Enterprise Production API Client for Spring Boot 3 Backend
 * Communicates with /api/v1/* versioned endpoints
 */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string>;
  timestamp?: string;
  requestId?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Includes secure HTTP-only session cookie
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected network or server error occurred');
  }
}
