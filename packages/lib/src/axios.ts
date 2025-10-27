import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';

export interface AxiosConfigOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  code: number;
  msg: string;
}

/**
 * 默认配置
 */
const defaultConfig: AxiosConfigOptions = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * 自定义 API 错误类
 */
export class ApiError extends Error {
  status?: number;
  data?: unknown;
  code?: string;

  constructor(error: AxiosError) {
    super(error.message);
    this.name = 'ApiError';
    this.status = error.response?.status;
    this.data = error.response?.data;
    this.code = error.code;
  }

  get isNetworkError(): boolean {
    return !this.status;
  }

  get isServerError(): boolean {
    return this.status !== undefined && this.status >= 500;
  }

  get isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

/**
 * 处理 Axios 错误
 */
function handleAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return new ApiError(error);
  }

  // 非 Axios 错误
  if (error instanceof Error) {
    const apiError = new ApiError({
      message: error.message,
      name: error.name
    } as AxiosError);
    return apiError;
  }

  // 未知错误
  return new ApiError({
    message: 'An unknown error occurred',
    name: 'UnknownError'
  } as AxiosError);
}

/**
 * 扩展的 Axios 实例接口
 */
export interface ExtendedAxiosInstance {
  /**
   * GET 请求，返回完整响应结构
   */
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * POST 请求，返回完整响应结构
   */
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * PUT 请求，返回完整响应结构
   */
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * PATCH 请求，返回完整响应结构
   */
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * DELETE 请求，返回完整响应结构
   */
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * 通用请求方法，返回完整响应结构
   */
  request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>>;

  /**
   * 访问原始 Axios 实例
   */
  instance: AxiosInstance;
}

/**
 * 获取 baseURL
 * 服务端：使用配置项中的 baseURL
 * 客户端：从 localStorage 读取
 */
function getBaseURL(configBaseURL?: string): string | undefined {
  // 服务端环境，使用配置项中的 baseURL
  if (typeof window === 'undefined') {
    return configBaseURL;
  }

  // 客户端环境，优先使用 localStorage，fallback 到配置项
  try {
    const storedBaseURL = localStorage.getItem('API_BASE_URL');
    return storedBaseURL || configBaseURL;
  } catch {
    // localStorage 不可用时，使用配置项
    return configBaseURL;
  }
}

/**
 * 创建扩展的 Axios 实例
 */
export function createAxiosInstance(options: AxiosConfigOptions = {}): ExtendedAxiosInstance {
  const config = { ...defaultConfig, ...options };

  const axiosInstance = axios.create({
    baseURL: getBaseURL(config.baseURL),
    timeout: config.timeout,
    headers: config.headers
  });

  // 请求拦截器
  axiosInstance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      // 添加请求时间戳
      if (requestConfig.headers) {
        requestConfig.headers['X-Request-Time'] = new Date().toISOString();
      }

      return requestConfig;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器 - 返回完整响应结构并处理错误
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 返回完整的响应结构 { data, code, msg }
      return response.data as any;
    },
    (error: AxiosError) => {
      // 统一错误处理
      throw handleAxiosError(error);
    }
  );

  // 直接封装方法，返回扩展实例
  return {
    async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return axiosInstance.get(url, config);
    },

    async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return axiosInstance.post(url, data, config);
    },

    async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return axiosInstance.put(url, data, config);
    },

    async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return axiosInstance.patch(url, data, config);
    },

    async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return axiosInstance.delete(url, config);
    },

    async request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
      return axiosInstance.request(config);
    },

    instance: axiosInstance
  };
}

export const http = createAxiosInstance();

// Re-export types for convenience
export type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
