import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuickContact } from "@/components/shared/quick-contact";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <QuickContact />
    </>
  );
}
