import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { WhyExists } from "@/components/landing/WhyExists";
import { Deliverables } from "@/components/landing/Deliverables";
import { Solutions } from "@/components/landing/Solutions";
import { Process } from "@/components/landing/Process";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Header />
      <Hero />
      <WhyExists />
      <Deliverables />
      <Solutions />
      <Process />
      <FAQ />
      <Footer />
    </main>
  );
}
