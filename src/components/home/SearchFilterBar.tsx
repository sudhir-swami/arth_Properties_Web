import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';
import { PropertyType, TransactionType } from '@/types';

interface SearchFilterBarProps {
  initialTransactionType?: TransactionType;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  initialTransactionType = 'buy',
}) => {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<TransactionType>(initialTransactionType);
  const [propertyType, setPropertyType] = useState<string>('all');
  const [location, setLocation] = useState<string>('');
  const [budgetMax, setBudgetMax] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (transactionType) params.append('transaction', transactionType);
    if (propertyType && propertyType !== 'all') params.append('type', propertyType);
    if (location.trim()) params.append('location', location.trim());
    if (budgetMax) params.append('maxPrice', budgetMax);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 md:p-6 max-w-5xl mx-auto backdrop-blur-md">
      {/* Transaction Toggle (Buy vs Rent) */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setTransactionType('buy');
            setBudgetMax('');
          }}
          className={`px-5 py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
            transactionType === 'buy'
              ? 'bg-navy-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Buy Property
        </button>
        <button
          type="button"
          onClick={() => {
            setTransactionType('rent');
            setBudgetMax('');
          }}
          className={`px-5 py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
            transactionType === 'rent'
              ? 'bg-navy-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Rent Property
        </button>
      </div>

      {/* Search Form Fields */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
        {/* Preferred Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold-600" />
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none text-slate-800 transition-all"
          >
            <option value="">All Pune Locations</option>
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

        {/* Property Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-gold-600" />
            Category
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none text-slate-800 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="apartment">Apartments / Flats</option>
            <option value="independent_house">Independent Houses</option>
            <option value="villa">Villas / Bungalows</option>
            <option value="plot">Residential Plots</option>
            <option value="commercial_shop">Commercial Shops</option>
            <option value="office">Commercial Offices</option>
          </select>
        </div>

        {/* Budget Limit */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-gold-600" />
            Max Budget
          </label>
          <select
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none text-slate-800 transition-all"
          >
            <option value="">Any Budget</option>
            {transactionType === 'buy' ? (
              <>
                <option value="5000000">Up to ₹50 Lakh</option>
                <option value="7500000">Up to ₹75 Lakh</option>
                <option value="10000000">Up to ₹1 Crore</option>
                <option value="15000000">Up to ₹1.5 Crore</option>
                <option value="25000000">Up to ₹2.5 Crore</option>
              </>
            ) : (
              <>
                <option value="15000">Up to ₹15,000 / mo</option>
                <option value="25000">Up to ₹25,000 / mo</option>
                <option value="40000">Up to ₹40,000 / mo</option>
                <option value="60000">Up to ₹60,000 / mo</option>
              </>
            )}
          </select>
        </div>

        {/* Submit Search Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-navy-950 font-extrabold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
};
