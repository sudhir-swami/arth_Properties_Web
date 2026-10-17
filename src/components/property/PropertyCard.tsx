import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '@/types';
import { formatPrice, formatArea, formatPropertyType, getWhatsAppLink } from '@/utils/formatters';
import { MapPin, Bed, Bath, Maximize2, MessageSquare, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onEnquire?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEnquire }) => {
  // Find cover image or default to first image or placeholder
  const coverImage =
    property.images?.find((img) => img.is_cover)?.image_url ||
    property.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const isDemo = property.title.includes('[DEMO]') || property.slug.includes('demo');
  const cleanTitle = property.title.replace(/^\[DEMO\]\s*/i, '');

  const propertyUrl = `${window.location.origin}/properties/${property.slug}`;
  const waUrl = getWhatsAppLink(
    '+919689965655',
    `Hello Arth Properties, I am interested in "${cleanTitle}" located in ${property.location} (${propertyUrl}). Please share more details.`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={cleanTitle}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {/* Buy / Rent Badge */}
          <span
            className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-sm ${
              property.transaction_type === 'rent'
                ? 'bg-blue-600 text-white'
                : 'bg-navy-900 text-white'
            }`}
          >
            For {property.transaction_type === 'rent' ? 'Rent' : 'Sale'}
          </span>

          {/* Featured Badge */}
          {property.featured && (
            <span className="px-2.5 py-1 text-xs font-bold tracking-wider rounded-md bg-gold-500 text-navy-950 shadow-sm">
              Featured
            </span>
          )}

          {/* Demo Badge */}
          {isDemo && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-rose-600/90 text-white tracking-widest">
              Demo
            </span>
          )}
        </div>

        {/* Status indicator if not available */}
        {property.status !== 'available' && (
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-1.5 bg-white text-navy-950 font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg">
              {property.status.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Price Overlay Banner */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-transparent p-3.5 pt-7 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold block">
              {property.transaction_type === 'rent' ? 'Monthly Rent' : 'Expected Price'}
            </span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              {formatPrice(
                property.transaction_type === 'rent' ? property.monthly_rent : property.price,
                property.transaction_type
              )}
            </span>
          </div>

          <span className="text-xs font-medium px-2 py-1 rounded bg-white/20 text-white backdrop-blur-md">
            {formatPropertyType(property.property_type)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-700 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span className="line-clamp-1">{property.location}, Pune</span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.slug}`} className="block">
            <h3 className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1 text-base">
              {cleanTitle}
            </h3>
          </Link>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-2 py-3 mt-2 border-y border-slate-100 text-xs text-slate-600">
            {property.bedrooms !== null && property.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms !== null && property.bathrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{formatArea(property.area, property.area_unit)}</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-3 flex items-center justify-between gap-2">
          {/* WhatsApp Direct Inquiry */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            title="Enquire on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
            <span>WhatsApp</span>
          </a>

          {/* View Details Button */}
          <Link
            to={`/properties/${property.slug}`}
            className="py-2 px-3.5 rounded-lg text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 transition-colors flex items-center justify-center gap-1 group/btn shrink-0"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
