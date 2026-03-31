import Header from "./components/Header";
import Hero from "./components/Hero";
import Moment from "./components/Moment";
import WhatBloomIs from "./components/WhatBloomIs";
import CivicOS from "./components/CivicOS";
import HowItWorks from "./components/HowItWorks";
import ConversationsOptionA from "./components/ConversationsOptionA";
import SmarterTogether from "./components/SmarterTogether";
import ForCommunities from "./components/ForCommunities";
import AIAlly from "./components/AIAlly";
import Federated from "./components/Federated";
import Principles from "./components/Principles";
import Team from "./components/Team";
import StayInTheLoop from "./components/StayInTheLoop";
import Footer from "./components/Footer";

/**
 * BLOOM Marketing Site — single-page layout
 *
 * Section order:
 *   Hero → Moment → What BLOOM Is → CivicOS → How It Works → Active Conversations →
 *   Smarter Together → For Civic Hosts →
 *   AI Ally → Federated → Not Another Platform → Team →
 *   Stay in the Loop → Footer
 */
export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main>
        <Hero />
        <Moment />
        <WhatBloomIs />
        <CivicOS />
        <HowItWorks />
        <ConversationsOptionA />
        <SmarterTogether />
        <ForCommunities />
        <AIAlly />
        <Federated />
        <Principles />
        <Team />
        <StayInTheLoop />
      </main>
      <Footer />
    </div>
  );
}
