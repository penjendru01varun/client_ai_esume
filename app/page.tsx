import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { UploadSection } from "@/components/upload-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div id="upload">
          <UploadSection />
        </div>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
