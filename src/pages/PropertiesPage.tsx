import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Property, PropertyFilters, PropertyType, TransactionType } from '@/types';
import { propertyService } from '@/services/propertyService';
import { PropertyCard } from '@/components/property/PropertyCard';
import { EnquiryModal } from '@/components/common/EnquiryModal';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Home,
  MapPin,
  Building,
  RotateCcw,
  Loader2,
} from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL params
  const [transactionType, setTransactionType] = useState<string>(
    searchParams.get('transaction') || 'all'
  );
  const [propertyType, setPropertyType] = useState<string>(
    searchParams.get('type') || 'all'
  );
  const [location, setLocation] = useState<string>(
    searchParams.get('location') || ''
  );
  const [bedrooms, setBedrooms] = useState<string>(
    searchParams.get('bedrooms') || 'all'
  );
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get('minPrice') || ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get('maxPrice') || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Enquiry modal state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState<boolean>(false);

  // Synchronize state when URL search params change
  useEffect(() => {
    const t = searchParams.get('transaction');
    if (t) setTransactionType(t);
    const p = searchParams.get('type');
    if (p) setPropertyType(p);
    const l = searchParams.get('location');
    if (l) setLocation(l);
    const max = searchParams.get('maxPrice');
    if (max) setMaxPrice(max);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Fetch properties from Supabase / mock service
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filterObj: PropertyFilters = {
      transaction_type: transactionType === 'all' ? undefined : (transactionType as TransactionType),
      property_type: propertyType === 'all' ? undefined : (propertyType as PropertyType),
      location: location.trim() || undefined,
      bedrooms: bedrooms === 'all' ? undefined : Number(bedrooms),
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      searchQuery: searchQuery.trim() || undefined,
      sortBy,
    };

    propertyService
      .getProperties(filterObj, false)
      .then((res) => {
        if (isMounted) {
          setProperties(res.properties);
          setTotalCount(res.totalCount);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching filtered properties:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [transactionType, propertyType, location, bedrooms, minPrice, maxPrice, searchQuery, sortBy]);

  // Clear all filters handler
  const handleClearFilters = () => {
    setTransactionType('all');
    setPropertyType('all');
    setLocation('');
    setBedrooms('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    transactionType !== 'all' ||
    propertyType !== 'all' ||
    Boolean(location) ||
    bedrooms !== 'all' ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(searchQuery);

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight">
            Properties in Hadapsar & Pune
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            Discover verified residential apartments, independent houses, commercial shops, and plots.
          </p>
        </div>

        {/* Top Controls Bar: Search, Mobile Filter Toggle, and Sort */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, locality, keywords..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Filter Toggle (Mobile) + Sort Dropdown + Count */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-navy-900 bg-slate-100 rounded-xl border border-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Results Count */}
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline-block">
              {loading ? 'Searching...' : `${totalCount} ${totalCount === 1 ? 'property' : 'properties'} found`}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden lg:inline-block">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none text-slate-700"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters (Desktop) + Property Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
                <Filter className="w-4 h-4 text-gold-600" />
                <span>Refine Search</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-gold-700 hover:text-gold-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Buy vs Rent */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'buy', label: 'Buy' },
                    { id: 'rent', label: 'Rent' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTransactionType(t.id)}
                      className={`py-1.5 rounded-lg transition-all ${
                        transactionType === t.id
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-navy-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Property Category
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none text-slate-800"
                >
                  <option value="all">All Categories</option>
                  <option value="apartment">Apartments / Flats</option>
                  <option value="independent_house">Independent Houses</option>
                  <option value="villa">Villas / Bungalows</option>
                  <option value="plot">Plots</option>
                  <option value="commercial_shop">Commercial Shops</option>
                  <option value="office">Commercial Offices</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Location / Locality
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none text-slate-800"
                >
                  <option value="">All Pune Localities</option>
                  <option value="Hadapsar">Hadapsar</option>
                  <option value="Gadital">Gadital</option>
                  <option value="Magarpatta">Magarpatta City</option>
                  <option value="Amanora">Amanora Park Town</option>
                  <option value="Saswad Road">Saswad Road</option>
                  <option value="Handewadi">Handewadi Road</option>
                  <option value="Fursungi">Fursungi</option>
                  <option value="Mundhwa">Mundhwa</option>
                  <option value="Wanowrie">Wanowrie</option>
                  <option value="Kharadi">Kharadi</option>
                </select>
              </div>

              {/* Bedrooms (BHK) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bedrooms (BHK)
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                  {[
                    { id: 'all', label: 'All' },
                    { id: '1', label: '1 BHK' },
                    { id: '2', label: '2 BHK' },
                    { id: '3', label: '3+ BHK' },
                  ].map((bhk) => (
                    <button
                      key={bhk.id}
                      type="button"
                      onClick={() => setBedrooms(bhk.id)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        bedrooms === bhk.id
                          ? 'border-navy-900 bg-navy-900 text-white font-extrabold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {bhk.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Budget (Max)
                </label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none text-slate-800"
                >
                  <option value="">Any Budget</option>
                  {transactionType === 'rent' ? (
                    <>
                      <option value="15000">Up to ₹15,000 / mo</option>
                      <option value="25000">Up to ₹25,000 / mo</option>
                      <option value="40000">Up to ₹40,000 / mo</option>
                      <option value="60000">Up to ₹60,000 / mo</option>
                      <option value="100000">Up to ₹1,00,000 / mo</option>
                    </>
                  ) : (
                    <>
                      <option value="5000000">Up to ₹50 Lakh</option>
                      <option value="7500000">Up to ₹75 Lakh</option>
                      <option value="10000000">Up to ₹1 Crore</option>
                      <option value="15000000">Up to ₹1.5 Crore</option>
                      <option value="25000000">Up to ₹2.5 Crore</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </aside>

          {/* Property Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse">
                    <div className="aspect-[16/10] bg-slate-200 rounded-xl mb-4" />
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-slate-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-1">
                  No Properties Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
                  We could not find any available properties matching your current filter criteria. Try adjusting the budget, category, or location.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEnquire={(p) => {
                      setSelectedProperty(p);
                      setEnquiryOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gold-600" />
                  <span>Filter Properties</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-navy-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Buy vs Rent */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Transaction Type
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                    {['all', 'buy', 'rent'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTransactionType(t)}
                        className={`py-2 rounded-lg capitalize ${
                          transactionType === t
                            ? 'bg-navy-900 text-white font-bold'
                            : 'text-slate-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="all">All Categories</option>
                    <option value="apartment">Apartments / Flats</option>
                    <option value="independent_house">Independent Houses</option>
                    <option value="villa">Villas / Bungalows</option>
                    <option value="plot">Plots</option>
                    <option value="commercial_shop">Commercial Shops</option>
                    <option value="office">Commercial Offices</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Locality
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="">All Localities</option>
                    <option value="Hadapsar">Hadapsar</option>
                    <option value="Gadital">Gadital</option>
                    <option value="Magarpatta">Magarpatta</option>
                    <option value="Amanora">Amanora</option>
                    <option value="Saswad Road">Saswad Road</option>
                    <option value="Handewadi">Handewadi</option>
                    <option value="Fursungi">Fursungi</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    {['all', '1', '2', '3'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBedrooms(b)}
                        className={`py-2 rounded-xl border ${
                          bedrooms === b
                            ? 'border-navy-900 bg-navy-900 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {b === 'all' ? 'All' : `${b} BHK`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Budget */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Max Budget
                  </label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="">Any Budget</option>
                    <option value="25000">Up to ₹25,000 / mo</option>
                    <option value="5000000">Up to ₹50 Lakh</option>
                    <option value="10000000">Up to ₹1 Crore</option>
                    <option value="20000000">Up to ₹2 Crore</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 text-xs font-bold text-white bg-navy-900 rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};
