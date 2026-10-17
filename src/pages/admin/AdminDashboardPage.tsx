import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { enquiryService } from '@/services/enquiryService';
import { Enquiry } from '@/types';
import { formatDate } from '@/utils/formatters';
import {
  Building,
  CheckCircle,
  Sparkles,
  EyeOff,
  MessageSquare,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Phone,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    publishedProperties: 0,
    featuredProperties: 0,
    unpublishedProperties: 0,
    newEnquiries: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      propertyService.getDashboardStats(),
      enquiryService.getEnquiries('all'),
    ])
      .then(([statsData, enquiriesData]) => {
        if (isMounted) {
          setStats(statsData);
          setRecentEnquiries(enquiriesData.slice(0, 5));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching admin dashboard data:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      title: 'Total Listings',
      value: stats.totalProperties,
      icon: Building,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Published (Live)',
      value: stats.publishedProperties,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Featured Properties',
      value: stats.featuredProperties,
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Unpublished / Drafts',
      value: stats.unpublishedProperties,
      icon: EyeOff,
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      iconColor: 'text-slate-600',
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Arth Properties • Hadapsar Management System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span>Add Property</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
          >
            <MessageSquare className="w-4 h-4 text-slate-600" />
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${card.color} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">{card.title}</span>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">
                {loading ? '...' : card.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Enquiries Table & Quick Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Enquiries (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-navy-900">
                Recent Customer Enquiries
              </h2>
              <p className="text-xs text-slate-500">Latest leads submitted via public website</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-gold-700 hover:text-gold-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading enquiries...</div>
          ) : recentEnquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No customer enquiries received yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-navy-900">{enq.customer_name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          enq.status === 'new'
                            ? 'bg-rose-100 text-rose-800'
                            : enq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : enq.status === 'follow_up'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {enq.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold-600" />
                        {enq.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(enq.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic mt-1">
                      "{enq.message}"
                    </p>
                  </div>

                  <Link
                    to="/admin/enquiries"
                    className="self-end sm:self-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-lg text-xs font-semibold shrink-0"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Shortcuts & Guidance (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
              Quick Management
            </h3>
            <div className="space-y-2.5">
              <Link
                to="/admin/properties/new"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-gold-50 border border-slate-200 hover:border-gold-300 text-xs font-bold text-navy-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-gold-600" />
                  <span>Add New Property Listing</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/admin/properties"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-gold-50 border border-slate-200 hover:border-gold-300 text-xs font-bold text-navy-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-gold-600" />
                  <span>View & Edit All Properties</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-gold-50 border border-slate-200 hover:border-gold-300 text-xs font-bold text-navy-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-gold-600" />
                  <span>Update Agency Phone / Copy</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Business Info Reminder */}
          <div className="bg-navy-950 text-white rounded-3xl p-6 border border-navy-800 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-gold-400 text-sm">Arth Properties Details</h4>
            <p className="text-slate-300">
              Address: Near Siddhi Driving School, Unnati Nagar, Gadital, Hadapsar, Pune 411028.
            </p>
            <p className="text-slate-300">
              Contact: +91 96899 65655
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
