import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, Landmark, Map, Store, Briefcase, ArrowUpRight } from 'lucide-react';

export const PropertyCategories: React.FC = () => {
  const categories = [
    {
      id: 'apartment',
      name: 'Apartments & Flats',
      marathi: 'फ्लॅट्स आणि अपार्टमेंट्स',
      description: '1, 2 & 3 BHK modern apartments in gated communities with modern amenities.',
      icon: Building2,
      count: 'Available for Buy & Rent',
      href: '/properties?type=apartment',
      bgImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'independent_house',
      name: 'Independent Houses',
      marathi: 'स्वतंत्र घरे',
      description: 'Private residential homes with personal space, privacy, and parking.',
      icon: Home,
      count: 'For Families & Long-Term',
      href: '/properties?type=independent_house',
      bgImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'villa',
      name: 'Villas & Bungalows',
      marathi: 'व्हिला आणि बंगले',
      description: 'Luxury multi-level villas with private terraces and serene surroundings.',
      icon: Landmark,
      count: 'Premium Living',
      href: '/properties?type=villa',
      bgImg: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'plot',
      name: 'Residential Plots',
      marathi: 'प्लॉट्स',
      description: 'Collector NA sanctioned plots ready for customized home construction.',
      icon: Map,
      count: 'Clear Title Investment',
      href: '/properties?type=plot',
      bgImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'commercial_shop',
      name: 'Commercial Shops',
      marathi: 'व्यावसायिक दुकाने',
      description: 'High-visibility retail shops on busy arterial roads and commercial complexes.',
      icon: Store,
      count: 'High Footfall Locations',
      href: '/properties?type=commercial_shop',
      bgImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'office',
      name: 'Commercial Offices',
      marathi: 'कार्यालयीन जागा',
      description: 'Plug-and-play and bare-shell corporate office spaces in business hubs.',
      icon: Briefcase,
      count: 'Corporate Workspaces',
      href: '/properties?type=office',
      bgImg: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-gold-600 font-bold text-xs uppercase tracking-widest block mb-2">
            Diverse Portfolio
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight">
            Explore Properties by Category
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-3">
            Whether you are looking to buy your dream residence or rent commercial retail space in Hadapsar, Arth Properties has options across categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.href}
                className="group relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 hover:bg-white shadow-sm hover:shadow-card-hover transition-all duration-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{cat.marathi}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-navy-900">
                  <span>{cat.count}</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-gold-500 group-hover:text-navy-950 flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
