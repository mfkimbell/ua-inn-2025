import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import { AxiosRequestConfig } from "axios";
import { nextApi } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getNextApiFunction = (options?: AxiosRequestConfig) => {
  if (options?.method === "GET") {
    return nextApi.get;
  }

  if (options?.method === "POST") {
    return nextApi.post;
  }

  if (options?.method === "PUT") {
    return nextApi.put;
  }

  if (options?.method === "DELETE") {
    return nextApi.delete;
  }

  return nextApi.get;
};

export async function fetch<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T | null> {
  const nextApiFunction = getNextApiFunction(options);
  try {
    const response: AxiosResponse<T> = await nextApiFunction(url, options);

    if (!response) {
      toast.error("No response received from server");
      return null;
    }

    if (response.status >= 400) {
      toast.error(`Error: ${response.statusText}`);
      return null;
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 307) {
        window.location.href = error.response.data.url;
        return null;
      } else {
        console.error(JSON.stringify(error.response?.data.error, null, 2));
      }
    }

    toast.error("An unexpected error occurred");
    return null;
  }
}
