"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import decryptData from "@/utils/decryptData";
import { useSearchStore as store } from "./search";
import { useInterfaceStore } from "@/state/interface";
import { v4 as uuidv4 } from "uuid";

const fetchData = async (url: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: any, options?: any) => {
  let response;
  switch (method) {
    case "GET":
      const {
        defaultKeyword = options?.defaultKeyword || store.getState().search,
        defaultPageNumber = options?.defaultPageNumber || store.getState().pageNumber,
        defaultPageLimit = options?.defaultPageLimit || store.getState().pageLimit,
        defaultFilter = `${options?.defaultFilter ?? ""}${
          store.getState().filter ? `|${store.getState().filter}` : ""
        }`,
        defaultSort = options?.defaultSort || store.getState().sort,
        defaultInclude = options?.defaultInclude || store.getState().include,
        defaultParams = options?.defaultParams || store.getState().params,
      } = options || {};

      response = await axios.get(url, {
        params: {
          keyword: defaultKeyword,
          pageNumber: defaultPageNumber,
          limit: defaultPageLimit,
          filterOptions: defaultFilter,
          sortOptions: defaultSort,
          includeOptions: defaultInclude,
          ...defaultParams,
        },
      });

      break;
    case "POST":
      response = await axios.post(url, data);
      break;
    case "PUT":
      response = await axios.put(url, data);
      break;
    case "DELETE":
      response = await axios.delete(url, { data });
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
  if (method === "GET" && typeof response.data.payload === "string") {
    response.data.payload = JSON.parse(decryptData(response.data.payload));
  }
  return response.data;
};
// Reusable Hook
const useApiHook = (options: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url?: string;
  key: string | Array<string | number>;
  filter?: any;
  params?: any;
  keyword?: string;
  sort?: any;
  include?: any;
  limit?: number;
  queriesToInvalidate?: string[];
  successMessage?: string;
  redirectUrl?: string;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  pageNumber?: number;
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  const { addAlert } = useInterfaceStore((state) => state);
  const router = useRouter();

  const {
    method,
    url,
    key,
    filter,
    params,
    limit,
    sort,
    include,
    queriesToInvalidate,
    successMessage,
    redirectUrl,
    keyword,
    pageNumber,
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 1000 * 60 * 5, // 5 minutes
    cacheTime = 1000 * 60 * 10, // 10 minutes
    onSuccessCallback,
    onErrorCallback,
  } = options;

  const queryKey = typeof key === "string" ? [key] : key;
  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchData(url!, "GET", undefined, {
        defaultKeyword: keyword,
        defaultFilter: filter,
        defaultSort: sort,
        defaultInclude: include,
        defaultPageLimit: limit,
        defaultPageNumber: pageNumber,
        defaultParams: params,
      }),
    enabled: enabled && method === "GET",
    refetchOnWindowFocus,
    retry: 1,
    staleTime: staleTime,
    gcTime: cacheTime,
    meta: {
      errorMessage: "An error occurred while fetching data",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { url?: string; formData?: any }) =>
      fetchData(url ? url : (data.url as any), method, data.formData),
    onSuccess: (data: any) => {
      if (successMessage) {
        addAlert({ id: uuidv4(), message: successMessage, type: "success", duration: 5000 });
      }

      queriesToInvalidate?.forEach((query: string) => {
        queryClient.invalidateQueries([query] as any);
      });

      if (redirectUrl) {
        router.push(redirectUrl);
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      console.log(error);
      const message = error.response?.data?.message || error.message || "An error occurred";
      addAlert({ id: uuidv4(), message, type: "error", duration: 5000 });
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  // Return based on method
  return method === "GET" ? query : mutation;
};

export default useApiHook;
