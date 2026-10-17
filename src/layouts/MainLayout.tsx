import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';
import { DemoNotice } from '@/components/common/DemoNotice';
import { EnquiryModal } from '@/components/common/EnquiryModal';

export const MainLayout: React.FC = () => {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Informational banner when running without live Supabase keys */}
      <DemoNotice />

      {/* Main Header */}
      <Header onOpenEnquiry={() => setEnquiryModalOpen(true)} />

      {/* Page Content */}
      <main className="flex-1">
        <Outlet context={{ openEnquiry: () => setEnquiryModalOpen(true) }} />
      </main>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Global Quick Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
