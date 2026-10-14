import Header, { ScrollArrow } from "./components/Header";
import Hero from "./components/Hero";
import Vision from "./components/Vision";
import Recommendations from "./components/Recommendations";
import CaseStudies from "./components/CaseStudies";
import WhatBloomIs from "./components/WhatBloomIs";
import CohortCard from "./components/CohortCard";
import Partners from "./components/Partners";
import LatestNews from "./components/LatestNews";
import Footer from "./components/Footer";
import { CohortFormModal } from "./components/CohortForm";

/**
 * BLOOM homepage — Public Assemblies on AI
 *
 * Section order:
 *   Hero → Vision (why) → Recommendations (Utah results) → The Work (Utah, Central Oregon) →
 *   What we do (how) → 2027 Cohort teaser → Partners → Latest news → Footer
 *
 * Other pages: /cohort/ (theory of change + application), /people/ (team), /news/ (press),
 * /how-we-work/ (approach).
 */
export default function App() {
  return (
    <div className="min-h-screen bg-cream text-maroon-900">
      <Header />
      <main>
        <Hero />
        <Vision />
        <Recommendations />
        <CaseStudies />
        <WhatBloomIs />
        <CohortCard />
        <Partners />
        <LatestNews />
      </main>
      <Footer />
      <ScrollArrow />
      <CohortFormModal />
    </div>
  );
}
