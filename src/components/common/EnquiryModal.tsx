import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquirySchema, EnquiryFormData } from '@/utils/validation';
import { enquiryService } from '@/services/enquiryService';
import { X, CheckCircle, Loader2, Send, Phone, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/formatters';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProperty?: {
    id: string;
    title: string;
    slug: string;
  };
  defaultType?: 'general' | 'callback' | 'site_visit' | 'property_enquiry';
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProperty,
  defaultType = 'general',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      enquiry_type: defaultProperty ? 'property_enquiry' : defaultType,
      property_id: defaultProperty?.id || null,
      message: defaultProperty
        ? `I am interested in learning more about "${defaultProperty.title}". Please share details and arrange a visit.`
        : 'Hello Arth Properties, I would like to get in touch regarding suitable properties in Pune.',
      customer_name: '',
      phone: '',
      email: '',
      preferred_location: '',
      budget: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: EnquiryFormData) => {
    setServerError(null);
    try {
      await enquiryService.submitEnquiry(data);
      setSubmitted(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || 'Failed to submit your enquiry. Please try again or reach us via WhatsApp.');
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setServerError(null);
    onClose();
  };

  const waUrl = getWhatsAppLink(
    '+919689965655',
    defaultProperty
      ? `Hello Arth Properties, I am interested in "${defaultProperty.title}" (${window.location.origin}/properties/${defaultProperty.slug}). Please provide more details.`
      : 'Hello Arth Properties, I would like to speak to your team regarding property availability in Hadapsar.'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between border-b border-navy-800">
          <div>
            <h3 className="text-lg font-bold">
              {defaultProperty ? 'Enquire About Property' : 'Get in Touch with Arth Properties'}
            </h3>
            <p className="text-xs text-gold-300">
              {defaultProperty ? defaultProperty.title : 'Hadapsar, Pune • Direct Assistance'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-navy-900">Thank You!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your enquiry has been received. A representative from Arth Properties will review your requirements and reach out on your phone number shortly.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Continue on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {serverError}
                </div>
              )}

              {/* Enquiry Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enquiry Type
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'general', label: 'General Enquiry' },
                    { id: 'callback', label: 'Request Callback' },
                    { id: 'site_visit', label: 'Site Visit' },
                    { id: 'property_enquiry', label: 'Property Details' },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors border-slate-200"
                    >
                      <input
                        type="radio"
                        value={type.id}
                        {...register('enquiry_type')}
                        className="text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-medium text-slate-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Deshmukh"
                  {...register('customer_name')}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                />
                {errors.customer_name && (
                  <p className="mt-1 text-xs text-red-600">{errors.customer_name.message}</p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      {...register('phone')}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Preferred Location & Budget (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hadapsar, Gadital"
                    {...register('preferred_location')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approximate Budget
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50 - 75 Lakh"
                    {...register('budget')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your property requirements, visit timing, or questions..."
                  {...register('message')}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-900/60 text-white text-sm font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-gold-400" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                  <span>WhatsApp Instead</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
