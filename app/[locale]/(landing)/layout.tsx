import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { ChatWidget } from "@/features/chat";
import Header from "@/features/landing/components/header";
import Footer from "@/features/landing/components/footer";
import { buildSiteSettingsFallback } from "@/features/landing/lib/site-settings-fallback";
import { getSiteSettings } from "@/features/landing/services/settings";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LandingLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tFooter = await getTranslations("Footer");
  const settings = await getSiteSettings(
    locale,
    buildSiteSettingsFallback({ description: tFooter("description") }),
  );

  return (
    <div className="bg-white!">
      <Header logoSrc={settings.logoSrc} logoAlt={tFooter("logoAlt")} />
      {children}
      <Footer settings={settings} />
      <ChatWidget logoSrc={settings.logoSrc} logoAlt={tFooter("logoAlt")} />
    </div>
  );
}
