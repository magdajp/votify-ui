import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import Cookies from "js-cookie";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = Cookies.get("jwt_token");

    if (token) {
        const headers = new AxiosHeaders(config.headers);
        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
    }

    return config;
});

export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
};

export const apiPost = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
};

export const apiPut = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
};
