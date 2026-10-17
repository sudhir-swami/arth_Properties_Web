import React, { useEffect, useState } from 'react';
import { enquiryService } from '@/services/enquiryService';
import { Enquiry, EnquiryStatus } from '@/types';
import { formatDate, getWhatsAppLink } from '@/utils/formatters';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trash2,
  Filter,
  Loader2,
  ExternalLink,
  IndianRupee,
} from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await enquiryService.getEnquiries(statusFilter);
      setEnquiries(data);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await enquiryService.updateEnquiryStatus(id, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await enquiryService.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Customer Enquiries & Leads
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review callback requests, site visit bookings, and property queries
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none"
          >
            <option value="all">All Enquiries</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow Up</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No customer enquiries found in this category.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enquiries.map((enq) => {
              const waReplyUrl = getWhatsAppLink(
                enq.phone,
                `Hello ${enq.customer_name}, this is from Arth Properties regarding your enquiry. How may we assist you?`
              );

              return (
                <div key={enq.id} className="p-6 hover:bg-slate-50/60 transition-colors space-y-4">
                  {/* Top Bar: Name, Type, Date, Status Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-base text-navy-900">
                        {enq.customer_name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {enq.enquiry_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(enq.created_at)}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-semibold text-slate-400">Status:</span>
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none ${
                          enq.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : enq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : enq.status === 'follow_up'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Badges & Associated Property */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <a
                      href={`tel:${enq.phone}`}
                      className="inline-flex items-center gap-1.5 font-bold text-navy-900 hover:text-gold-600 bg-slate-100 px-2.5 py-1 rounded-lg"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      <span>{enq.phone}</span>
                    </a>

                    {enq.email && (
                      <a
                        href={`mailto:${enq.email}`}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-navy-900 bg-slate-100 px-2.5 py-1 rounded-lg"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{enq.email}</span>
                      </a>
                    )}

                    {enq.preferred_location && (
                      <span className="inline-flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Prefers: {enq.preferred_location}</span>
                      </span>
                    )}

                    {enq.budget && (
                      <span className="inline-flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                        <span>Budget: {enq.budget}</span>
                      </span>
                    )}

                    {enq.property && (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-navy-900 bg-gold-50 border border-gold-200 px-2.5 py-1 rounded-lg">
                        <span>Property: {enq.property.title.replace(/^\[DEMO\]\s*/i, '')}</span>
                      </span>
                    )}
                  </div>

                  {/* Message Quote */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    <p className="font-medium">"{enq.message}"</p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={waReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${enq.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-bold"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold-400" />
                        <span>Call Customer</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(enq.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
