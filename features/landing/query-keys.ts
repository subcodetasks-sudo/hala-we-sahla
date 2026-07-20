export const faqKeys = {
  all: ["faq"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  list: (locale: string) => [...faqKeys.lists(), locale] as const,
};
