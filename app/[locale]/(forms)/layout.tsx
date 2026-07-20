import { setRequestLocale } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function FormsLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <div className="min-h-full">{children}</div>;
}
