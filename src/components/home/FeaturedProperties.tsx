import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
  loading?: boolean;
  onEnquire?: (property: Property) => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  loading = false,
  onEnquire,
}) => {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Handpicked Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight">
              Featured Properties in Hadapsar & Pune
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2 max-w-2xl">
              Explore our selection of top-rated residential apartments, commercial premises, and rental homes.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-gold-600 group shrink-0 transition-colors"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4 text-gold-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl mb-4" />
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600 font-medium">No featured properties currently available.</p>
            <Link
              to="/properties"
              className="mt-4 inline-block px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold"
            >
              Browse All Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEnquire={onEnquire}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
