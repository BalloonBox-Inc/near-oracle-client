import Header from "@nearoracle/src/components/header";
import Footer from "@nearoracle/src/components/footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-screen flex flex-col justify-between font-sans bg-black bg-main-image bg-cover">
      <Header />
      <main className="px-5 md:px-20 2xl:px-40">{children}</main>
      <Footer />
    </div>
  );
}
