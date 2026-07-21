import { queryOptions } from "@tanstack/react-query";
import { faqKeys } from "@/features/landing/query-keys";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

// TODO: replace with a real request to the FAQ endpoint once it is available.
const FAQS: Record<string, FaqItem[]> = {
  ar: [
    {
      id: "duration",
      question: "كم يستغرق تجديد العقد؟",
      answer:
        "تستغرق عملية تجديد العقد عادةً حوالي 5 أيام عمل من تاريخ استلام الطلب ومراجعة المستندات.",
    },
    {
      id: "required-data",
      question: "ما البيانات المطلوبة لتقديم الطلب؟",
      answer:
        "تحتاج إلى الهوية الوطنية أو الإقامة، جواز سفر العامل/ة، ونسخة من العقد القديم لإتمام تقديم الطلب.",
    },
    {
      id: "tracking",
      question: "كيف أتابع حالة طلبي؟",
      answer:
        "يمكنك تتبع حالة طلبك في أي وقت من خلال صفحة تتبع الطلبات باستخدام رقم الجوال أو رقم الطلب.",
    },
    {
      id: "payment",
      question: "متى يتم الدفع؟",
      answer:
        "يتم الدفع إلكترونيًا عند تقديم الطلب عبر المنصة، ويمكنك الاطلاع على رسوم الخدمة قبل التأكيد.",
    },
    {
      id: "electronic-contract",
      question: "هل يمكن استلام العقد إلكترونيًا؟",
      answer:
        "نعم، بمجرد اعتماد الطلب يصلك العقد الإلكتروني الجاهز مباشرة داخل المنصة.",
    },
    {
      id: "whatsapp",
      question: "هل يمكن التواصل عبر واتساب؟",
      answer:
        "نعم، يمكنك التواصل مع فريق الدعم مباشرة عبر واتساب لإتمام إجراءاتك بسهولة.",
    },
    {
      id: "cancellation",
      question: "هل يمكن إلغاء الطلب بعد إرساله؟",
      answer:
        "يمكن إلغاء الطلب خلال فترة المراجعة الأولية، وذلك بالتواصل مع فريق الدعم.",
    },
  ],
  en: [
    {
      id: "duration",
      question: "How long does contract renewal take?",
      answer:
        "Contract renewal usually takes about 5 business days from when we receive your request and review the documents.",
    },
    {
      id: "required-data",
      question: "What data is required to submit the request?",
      answer:
        "You'll need the national ID or Iqama, the worker's passport, and a copy of the previous contract to submit the request.",
    },
    {
      id: "tracking",
      question: "How do I track my request status?",
      answer:
        "You can track your request status at any time from the request tracking page using your phone number or request number.",
    },
    {
      id: "payment",
      question: "When is payment made?",
      answer:
        "Payment is made electronically when you submit the request through the platform, and you can review the service fee before confirming.",
    },
    {
      id: "electronic-contract",
      question: "Can the contract be received electronically?",
      answer:
        "Yes, as soon as your request is approved, the ready electronic contract is delivered directly within the platform.",
    },
    {
      id: "whatsapp",
      question: "Can I reach you over WhatsApp?",
      answer:
        "Yes, you can contact our support team directly on WhatsApp to complete your procedures easily.",
    },
    {
      id: "cancellation",
      question: "Can the request be cancelled after it's submitted?",
      answer:
        "The request can be cancelled during the initial review period by contacting our support team.",
    },
  ],
};

export async function fetchFaqs(locale: string): Promise<FaqItem[]> {
  return FAQS[locale] ?? FAQS.ar;
}

export function faqQueryOptions(locale: string) {
  return queryOptions({
    queryKey: faqKeys.list(locale),
    queryFn: () => fetchFaqs(locale),
  });
}
