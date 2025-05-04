import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';

const Landing = () => {
  // remember me 
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the "isRememberMe" flag is set in the local storage
    const isRememberMe = localStorage.getItem('isRememberMe') === 'true';
    if (isRememberMe) {
      // "Remember me" was checked
      // Retrieve the user ID from the local storage
      const userId = localStorage.getItem('userId');
      // Navigate to the dashboard with the user ID
      navigate('/dashboard', { state: { id: userId } });
    }
  }, [navigate]);

  return (
    <div className="landing-page">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;