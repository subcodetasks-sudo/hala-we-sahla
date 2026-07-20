import { setRequestLocale } from "next-intl/server";
import Header from "@/features/landing/components/header";
import Footer from "@/features/landing/components/footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LandingLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-white!">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
