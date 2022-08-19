import Header from "@nearoracle/src/components/header";
import Footer from "@nearoracle/src/components/footer";
import StarCanvas from '@nearoracle/src/components/StarCanvas';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='flex flex-col w-full min-h-screen font-sans space-bg bg-cover justify-between z-10'>
      <Header />
      <StarCanvas />
      <main className='w-full px-5 md:px-10 2xl:px-40 md:pt-0 pt-10 z-10'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
