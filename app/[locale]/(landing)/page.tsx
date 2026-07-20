import { setRequestLocale } from "next-intl/server";
import Hero from "@/features/landing/components/hero";
import Stats from "@/features/landing/components/stats";
import Pricing from "@/features/landing/components/pricing";
import Services from "@/features/landing/components/services";
import Faq from "@/features/landing/components/faq";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Stats />
      <Pricing />
      <Services />
      <Faq />
    </>
  );
}
