import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Property } from '@/types';
import { propertyService } from '@/services/propertyService';
import {
  formatPrice,
  formatArea,
  formatPropertyType,
  formatFurnishing,
  getWhatsAppLink,
} from '@/utils/formatters';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  CheckCircle2,
  Car,
  Armchair,
  Phone,
  MessageSquare,
  CalendarCheck,
  ChevronRight,
  ArrowLeft,
  Share2,
  Sparkles,
} from 'lucide-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { EnquiryModal } from '@/components/common/EnquiryModal';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Enquiry modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryType, setEnquiryType] = useState<'callback' | 'site_visit' | 'property_enquiry'>('property_enquiry');

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);
    setSelectedImageIndex(0);
    window.scrollTo(0, 0);

    propertyService
      .getPropertyBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        setProperty(data);
        setLoading(false);

        if (data) {
          propertyService
            .getSimilarProperties(data.id, data.property_type, 3)
            .then((sim) => {
              if (isMounted) setSimilarProperties(sim);
            });
        }
      })
      .catch((err) => {
        console.error('Error fetching property details:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-20 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 max-w-md mx-auto text-center shadow-sm">
          <h2 className="text-xl font-bold text-navy-900 mb-2">Property Not Found</h2>
          <p className="text-xs text-slate-600 mb-6">
            The property listing you requested could not be located or may have been unlisted.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse All Properties</span>
          </Link>
        </div>
      </div>
    );
  }

  const isDemo = property.title.includes('[DEMO]') || property.slug.includes('demo');
  const cleanTitle = property.title.replace(/^\[DEMO\]\s*/i, '');
  const images = property.images && property.images.length > 0
    ? property.images
    : [{ id: 'default', property_id: property.id, image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80', is_cover: true, sort_order: 0 }];

  const currentImageUrl = images[selectedImageIndex]?.image_url || images[0]?.image_url;

  // Contextual WhatsApp link
  const propertyUrl = window.location.href;
  const waUrl = getWhatsAppLink(
    '+919689965655',
    `Hello Arth Properties, I am interested in "${cleanTitle}" located in ${property.location} (${propertyUrl}). Please share more details and arrange a visit.`
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanTitle,
          text: `Check out this property in ${property.location} on Arth Properties:`,
          url: propertyUrl,
        });
      } catch {
        // user canceled share
      }
    } else {
      navigator.clipboard.writeText(propertyUrl);
      alert('Property link copied to clipboard!');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-gold-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/properties" className="hover:text-gold-600">Properties</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{cleanTitle}</span>
        </nav>

        {/* Top Header & Price Row */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    property.transaction_type === 'rent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-navy-900 text-white'
                  }`}
                >
                  For {property.transaction_type === 'rent' ? 'Rent' : 'Sale'}
                </span>

                <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {formatPropertyType(property.property_type)}
                </span>

                {property.featured && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-gold-100 text-gold-800 border border-gold-300">
                    Featured
                  </span>
                )}

                {isDemo && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-600 text-white tracking-widest">
                    Demo Listing
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight">
                {cleanTitle}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                <span>{property.address}</span>
              </div>
            </div>

            {/* Price & Share */}
            <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-2">
              <div className="text-left lg:text-right">
                <span className="text-xs uppercase font-semibold text-slate-400 block">
                  {property.transaction_type === 'rent' ? 'Monthly Rent' : 'Expected Price'}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                  {formatPrice(
                    property.transaction_type === 'rent' ? property.monthly_rent : property.price,
                    property.transaction_type,
                    false
                  )}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title="Share this property"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Gallery & Details (Left 8 cols) + Contact Sidebar (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-4">
              {/* Main Display Image */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-4">
                <img
                  src={currentImageUrl}
                  alt={cleanTitle}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Counter pill */}
                <div className="absolute bottom-3 right-3 bg-navy-950/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-gold-500 ring-2 ring-gold-500/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Key Specifications Grid */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>Property Overview</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                {property.bedrooms !== null && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                      <Bed className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Bedrooms</span>
                      <span className="font-bold text-navy-900">{property.bedrooms} BHK</span>
                    </div>
                  </div>
                )}

                {property.bathrooms !== null && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                      <Bath className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Bathrooms</span>
                      <span className="font-bold text-navy-900">{property.bathrooms} Baths</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                    <Maximize2 className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Super Built-up Area</span>
                    <span className="font-bold text-navy-900">{formatArea(property.area, property.area_unit)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                    <Armchair className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Furnishing</span>
                    <span className="font-bold text-navy-900">{formatFurnishing(property.furnishing_status)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Parking</span>
                    <span className="font-bold text-navy-900">{property.parking_available ? 'Available' : 'None'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Availability</span>
                    <span className="font-bold text-navy-900 capitalize">{property.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-navy-900 mb-4">
                Description
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-navy-900 mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-navy-900"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact & Visit Actions (4 cols sticky) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <h3 className="text-base font-bold text-navy-900 mb-1">
                Interested in this Property?
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Connect directly with Arth Properties for site visits, floor plans, and pricing discussions.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* 1. WhatsApp Button */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>

                {/* 2. Call Now */}
                <a
                  href="tel:+919689965655"
                  className="w-full py-3 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span>Call +91 96899 65655</span>
                </a>

                {/* 3. Schedule Site Visit */}
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryType('site_visit');
                    setEnquiryModalOpen(true);
                  }}
                  className="w-full py-3 px-4 bg-gold-50 hover:bg-gold-100 text-gold-900 border border-gold-300 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4 text-gold-600" />
                  <span>Schedule Site Visit</span>
                </button>

                {/* 4. Request Callback */}
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryType('callback');
                    setEnquiryModalOpen(true);
                  }}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Request a Callback</span>
                </button>
              </div>

              {/* Agency Trust Note */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Arth Properties • Hadapsar, Pune
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Direct customer assistance with no pressure
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-6">
              Similar Properties You May Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Property-specific enquiry modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultProperty={{
          id: property.id,
          title: cleanTitle,
          slug: property.slug,
        }}
        defaultType={enquiryType}
      />
    </div>
  );
};
