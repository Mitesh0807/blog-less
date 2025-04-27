import Header from "@/components/header";
import Footer from "@/components/footer";

type Props = {
  children: React.ReactNode;
};

const BlogLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default BlogLayout;