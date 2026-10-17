import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Property } from '@/types';
import { propertyService } from '@/services/propertyService';
import { Hero } from '@/components/home/Hero';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { PropertyCategories } from '@/components/home/PropertyCategories';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { AboutIntro } from '@/components/home/AboutIntro';
import { ContactCTA } from '@/components/home/ContactCTA';
import { EnquiryModal } from '@/components/common/EnquiryModal';

export const HomePage: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const outletContext = useOutletContext<{ openEnquiry?: () => void }>() || {};

  useEffect(() => {
    let isMounted = true;
    propertyService
      .getFeaturedProperties(6)
      .then((props) => {
        if (isMounted) {
          setFeaturedProperties(props);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load featured properties:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnquire = (property: Property) => {
    setSelectedProperty(property);
    setEnquiryOpen(true);
  };

  return (
    <>
      {/* 1. Hero Section with Integrated Search */}
      <Hero onOpenEnquiry={outletContext.openEnquiry} />

      {/* 2. Featured Properties */}
      <FeaturedProperties
        properties={featuredProperties}
        loading={loading}
        onEnquire={handleEnquire}
      />

      {/* 3. Property Categories */}
      <PropertyCategories />

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. About Arth Properties Introduction */}
      <AboutIntro />

      {/* 7. Contact Call To Action */}
      <ContactCTA onOpenEnquiry={outletContext.openEnquiry} />

      {/* Property-specific enquiry modal */}
      {selectedProperty && (
        <EnquiryModal
          isOpen={enquiryOpen}
          onClose={() => {
            setEnquiryOpen(false);
            setSelectedProperty(null);
          }}
          defaultProperty={{
            id: selectedProperty.id,
            title: selectedProperty.title,
            slug: selectedProperty.slug,
          }}
          defaultType="property_enquiry"
        />
      )}
    </>
  );
};
