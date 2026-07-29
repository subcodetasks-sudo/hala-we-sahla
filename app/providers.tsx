"use client";

import {
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";
import { getApiErrorMessages, type ApiErrorMessageFallbacks } from "@/lib/api";

const errorFallbacks: ApiErrorMessageFallbacks = {};

function toastApiError(error: unknown) {
  for (const message of getApiErrorMessages(error, errorFallbacks)) {
    toast.error(message, { id: `api-error:${message}` });
  }
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toastApiError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toastApiError(error);
      },
    }),
    defaultOptions: {
      queries: {
        // Prevent immediate re-fetch right after hydration.
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Common.errors");
  const queryClient = getQueryClient();

  errorFallbacks.network = t("network");
  errorFallbacks.timeout = t("timeout");
  errorFallbacks.unknown = t("unknown");

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
