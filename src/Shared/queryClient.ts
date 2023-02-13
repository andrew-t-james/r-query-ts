import { QueryClient, QueryObserverOptions } from "@tanstack/react-query";

const isTest = process.env.NODE_ENV === "test";

const clientOptions: QueryObserverOptions = {
  refetchOnMount: false,
  refetchOnReconnect: false,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: clientOptions,
  },
});

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...clientOptions,
      retry: 0,
    },
  },
});

export default isTest ? testQueryClient : queryClient;
