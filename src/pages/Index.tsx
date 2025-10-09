import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { CatalogPreview } from "@/components/CatalogPreview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <CatalogPreview />
      </main>
    </div>
  );
};

export default Index;