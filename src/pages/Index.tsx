import { useState } from "react";
import type { Vehicle } from "@/data/vehicles";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import VehicleList from "@/components/VehicleList";
import VehicleDetailModal from "@/components/VehicleDetailModal";
import BookingModal from "@/components/BookingModal";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import AdminLoginModal from "@/components/AdminLoginModal";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const { isAdmin } = useAdmin();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const scrollTo = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    setShowDetail(true);
  };

  const handleBookVehicle = (v: Vehicle) => {
    setShowDetail(false);
    setSelectedVehicle(v);
    setTimeout(() => setShowBooking(true), 200);
  };

  if (showAdmin && isAdmin) {
    return (
      <>
        <Navbar onScrollTo={scrollTo} />
        <AdminDashboard onExit={() => setShowAdmin(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onScrollTo={scrollTo} />
      <HeroSection onBrowse={() => scrollTo("vehicles")} />
      <StatsSection />
      <VehicleList onSelectVehicle={handleSelectVehicle} />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <Footer onSystemClick={() => setShowAdminLogin(true)} />

      <VehicleDetailModal
        vehicle={selectedVehicle}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onBook={handleBookVehicle}
      />
      <BookingModal
        vehicle={selectedVehicle}
        open={showBooking}
        onClose={() => setShowBooking(false)}
      />
      <AdminLoginModal
        open={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={() => {
          setShowAdminLogin(false);
          setShowAdmin(true);
        }}
      />
    </div>
  );
};

export default Index;