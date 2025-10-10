import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { WhyNow } from "@/components/WhyNow";
import { Benefits } from "@/components/Benefits";
import { CatalogPreview } from "@/components/CatalogPreview";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <WhyNow />
        <Benefits />
        <CatalogPreview />
        <ReviewsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;