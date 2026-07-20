"use client";

import { useQuery } from "@tanstack/react-query";
import { faqQueryOptions } from "@/features/landing/services/faq";

export function useFaqs(locale: string) {
  return useQuery(faqQueryOptions(locale));
}
