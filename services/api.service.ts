import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, Method } from 'axios';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class ApiService {
  private readonly apiClient: AxiosInstance;
  private readonly pendingRequests = new Map<string, AbortController>();

  constructor() {
    this.apiClient = axios.create({
      baseURL: this.normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL),
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private normalizeBaseUrl(baseUrl?: string): string {
    const fallback = 'http://localhost:3000';
    if (!baseUrl) {
      return fallback;
    }

    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private generateRequestKey(method: Method, endpoint: string): string {
    return `${String(method).toLowerCase()}:${endpoint}`;
  }

  private normalizeError(error: unknown): Error {
    if (!axios.isAxiosError(error)) {
      return new Error('Unexpected error occurred.');
    }

    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    if (axiosError.code === 'ERR_CANCELED') {
      return new Error('Request cancelled.');
    }

    if (axiosError.response) {
      const apiMessage =
        axiosError.response.data?.message ||
        axiosError.response.data?.error ||
        'Request failed.';
      return new Error(apiMessage);
    }

    if (axiosError.request) {
      return new Error('No response from server. Please try again later.');
    }

    return new Error(axiosError.message || 'Unexpected error occurred.');
  }

  async request<TResponse, TRequest = unknown>(
    method: ApiMethod,
    endpoint: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const requestKey = this.generateRequestKey(method, endpoint);

    if (this.pendingRequests.has(requestKey)) {
      const activeController = this.pendingRequests.get(requestKey);
      activeController?.abort('Duplicate request cancelled');
      this.pendingRequests.delete(requestKey);
    }

    const controller = new AbortController();
    this.pendingRequests.set(requestKey, controller);

    try {
      const response = await this.apiClient.request<TResponse>({
        method,
        url: endpoint,
        data,
        signal: controller.signal,
        ...config,
      });

      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }
}

export const apiService = new ApiService();
