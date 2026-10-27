/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ChatProvider } from './context/ChatContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ServiceCardsSection } from './components/ServiceCardsSection.tsx';
import { DoctorDiscoverySection } from './components/DoctorDiscoverySection.tsx';
import { LabTestsSection } from './components/LabTestsSection.tsx';
import { HealthInformationSection } from './components/HealthInformationSection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ChatbotPanel } from './components/Chatbot/ChatbotPanel.tsx';
import { AppointmentModal } from './components/Modals/AppointmentModal.tsx';
import { LabTestModal } from './components/Modals/LabTestModal.tsx';
import { LoginModal } from './components/Modals/LoginModal.tsx';
import { Doctor, LabTest, City } from './types/index.ts';

function HealthcareApp() {
  const [selectedCity, setSelectedCity] = useState<City>('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [activeSection, setActiveSection] = useState('home');

  // Modals state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentType, setAppointmentType] = useState<'in-clinic' | 'video'>('in-clinic');
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleBookDoctor = (doctor: Doctor, type: 'in-clinic' | 'video') => {
    setSelectedDoctor(doctor);
    setAppointmentType(type);
  };

  const handleBookLabTest = (test: LabTest) => {
    setSelectedLabTest(test);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation Header */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        onOpenLogin={() => setLoginModalOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section with Practo headline & Search Bar */}
        <HeroSection
          selectedCity={selectedCity}
          onSearch={(query) => {
            setSearchQuery(query);
            scrollToSection('doctors');
          }}
          onNavigateToDoctors={(specialty) => {
            if (specialty) setSelectedSpecialty(specialty);
            scrollToSection('doctors');
          }}
          onNavigateToLabs={() => scrollToSection('lab-tests')}
        />

        {/* 6 Core Service Cards */}
        <ServiceCardsSection
          onNavigateToDoctors={(specialty) => {
            if (specialty) setSelectedSpecialty(specialty);
            scrollToSection('doctors');
          }}
          onNavigateToLabs={() => scrollToSection('lab-tests')}
          onNavigateToHealthInfo={() => scrollToSection('health-info')}
        />

        {/* Doctor Discovery & Booking Directory */}
        <DoctorDiscoverySection
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={(spec) => setSelectedSpecialty(spec)}
          onBookDoctor={handleBookDoctor}
        />

        {/* Lab Tests & Health Checkups Catalog */}
        <LabTestsSection onBookTest={handleBookLabTest} />

        {/* Medical Education & Guides */}
        <HealthInformationSection />

        {/* Verified Testimonials */}
        <TestimonialsSection />

        {/* Healthcare FAQs */}
        <FaqSection />
      </main>

      {/* Comprehensive Practo-style Footer */}
      <Footer
        onNavigate={scrollToSection}
        onSelectSpecialty={(spec) => {
          setSelectedSpecialty(spec);
          scrollToSection('doctors');
        }}
      />

      {/* Floating AI Healthcare Chatbot Panel */}
      <ChatbotPanel />

      {/* Booking and Auth Modals */}
      <AppointmentModal
        doctor={selectedDoctor}
        initialType={appointmentType}
        onClose={() => setSelectedDoctor(null)}
      />

      <LabTestModal
        test={selectedLabTest}
        onClose={() => setSelectedLabTest(null)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <HealthcareApp />
      </ChatProvider>
    </ThemeProvider>
  );
}
