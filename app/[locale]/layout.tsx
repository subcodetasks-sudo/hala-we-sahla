import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DirectionProvider } from "@/components/ui/direction";
import Providers from "@/app/providers";
import { buildSiteSettingsFallback } from "@/features/landing/lib/site-settings-fallback";
import { buildSiteIcons, getSiteSettings } from "@/features/landing/services/settings";
import { routing } from "@/i18n/routing";
import { clashDisplay } from "@/lib/fonts";
import "../globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-arabic",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tFooter = await getTranslations({ locale, namespace: "Footer" });
  const settings = await getSiteSettings(
    locale,
    buildSiteSettingsFallback({ description: tFooter("description") }),
  );

  return {
    title:locale === "ar" ? "هلا و سهلا" : " Hala Wa Sahla",
    description: settings.description,
    icons: buildSiteIcons(settings.logoSrc),
  };
}

const RTL_LOCALES = new Set(["ar", "fa", "he", "ur"]);

function getDirection(locale: string) {
  const baseLocale = locale.toLowerCase().split("-")[0];
  return RTL_LOCALES.has(baseLocale) ? "rtl" : "ltr";
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${notoSansArabic.className} ${clashDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <DirectionProvider dir={direction} direction={direction}>
              {children}
            </DirectionProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
