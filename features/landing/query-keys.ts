export const faqKeys = {
  all: ["faq"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  list: (locale: string) => [...faqKeys.lists(), locale] as const,
};

export const plansKeys = {
  all: ["plans"] as const,
  lists: () => [...plansKeys.all, "list"] as const,
  list: (locale: string) => [...plansKeys.lists(), locale] as const,
};

export const settingsKeys = {
  all: ["settings"] as const,
  lists: () => [...settingsKeys.all, "list"] as const,
  list: (locale: string) => [...settingsKeys.lists(), locale] as const,
};
