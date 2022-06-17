import Header from "@nearoracle/src/components/header";
import Footer from "@nearoracle/src/components/footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-screen font-sans bg-black bg-cover justify-between">
      <Header />
      <main className="w-full px-5 md:px-10 2xl:px-40 md:pt-0 pt-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
