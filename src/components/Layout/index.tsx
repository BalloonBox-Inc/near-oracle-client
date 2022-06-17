import Header from "@nearoracle/src/components/header";
import Footer from "@nearoracle/src/components/footer";
import { callbackify } from "util";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-screen relative font-sans bg-black bg-cover">
      <Header />
      <main
        className="px-5 md:px-10 2xl:px-40 md:pt-0 pt-10"
        style={{ paddingBottom: "5rem" }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
