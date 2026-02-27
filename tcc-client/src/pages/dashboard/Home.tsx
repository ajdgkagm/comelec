import Header from "../../components/Header";
import Hero from "../../components/Hero";
import RegistrationForm from "../../components/RegistrationForm";
import StatusCard from "../../components/StatusCard";
import KnowledgeBase from "../../components/KnowledgeBase";
import Footer from "../../components/Footer";
import CookieConsent from "../../components/CookieConsent";
import ComelecNews from "../../components/ComelecNews";
export default function Home() {
  return (
    <>
      <Header />
      <CookieConsent />

      <Hero />

      <section className="grid">
        <RegistrationForm />
        <StatusCard />
      </section>
      <ComelecNews />
      <KnowledgeBase />
      <Footer />
    </>
  );
}
