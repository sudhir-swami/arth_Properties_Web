import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquirySchema, EnquiryFormData } from '@/utils/validation';
import { enquiryService } from '@/services/enquiryService';
import { getWhatsAppLink } from '@/utils/formatters';
import {
  MapPin,
  Phone,
  MessageSquare,
  Compass,
  Send,
  Loader2,
  CheckCircle,
  Building,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Near+Siddhi+Driving+School+Unnati+Nagar+Gadital+Hadapsar+Pune+411028';
  const waUrl = getWhatsAppLink('+919689965655', 'Hello Arth Properties, I would like to get in touch regarding properties in Hadapsar.');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      enquiry_type: 'general',
      customer_name: '',
      phone: '',
      email: '',
      preferred_location: '',
      budget: '',
      message: '',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setServerError(null);
    try {
      await enquiryService.submitEnquiry(data);
      setSubmitted(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || 'Unable to submit enquiry. Please call us or reach out via WhatsApp.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Contact Us • अर्थ प्रॉपर्टीज</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
            Connect with Arth Properties
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Have a question about a property, want to arrange a site visit, or need assistance selling or renting? Reach out to our team in Hadapsar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Details & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Business Contact Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-gold-600" />
                <span>Office Information</span>
              </h2>

              {/* Office Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Office Address</h3>
                  <p className="text-sm font-semibold text-navy-900 mt-1 leading-snug">
                    Arth Properties (अर्थ प्रॉपर्टीज)<br />
                    Near Siddhi Driving School,<br />
                    Unnati Nagar, Gadital, Hadapsar,<br />
                    Pune, Maharashtra 411028, India.
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 hover:text-gold-700 mt-2 underline underline-offset-4"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Get Google Maps Directions
                  </a>
                </div>
              </div>

              {/* Phone / Click-to-call */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Direct Contact</h3>
                  <a
                    href="tel:+919689965655"
                    className="text-base font-extrabold text-navy-900 hover:text-gold-600 block mt-1 transition-colors"
                  >
                    +91 96899 65655
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Call directly for immediate assistance</p>
                </div>
              </div>

              {/* WhatsApp Action */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">WhatsApp Support</h3>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-700 hover:text-emerald-800 block mt-1"
                  >
                    Chat with Arth Properties Team →
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Quick responses on WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm overflow-hidden">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200 relative">
                <iframe
                  title="Arth Properties Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.565985834887!2d73.9284!3d18.5028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c18d7f76901f%3A0x6b77ddb73252445!2sGadital%2C%20Hadapsar%2C%20Pune%2C%20Maharashtra%20411028!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <div className="pt-3 px-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Gadital, Hadapsar, Pune</span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-navy-900 hover:text-gold-600"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-8">
                Fill out the form below and an Arth Properties representative will get in touch with you promptly.
              </p>

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900">Enquiry Received</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out to Arth Properties. Our team will review your requirements and call you back shortly.
                  </p>
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 bg-navy-900 text-white text-xs font-bold rounded-xl"
                    >
                      Send Another Message
                    </button>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {serverError && (
                    <div className="p-4 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
                      {serverError}
                    </div>
                  )}

                  {/* Enquiry Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Purpose of Enquiry
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'general', label: 'General' },
                        { id: 'callback', label: 'Callback' },
                        { id: 'site_visit', label: 'Site Visit' },
                        { id: 'property_enquiry', label: 'Buy / Rent' },
                      ].map((t) => (
                        <label
                          key={t.id}
                          className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors border-slate-200"
                        >
                          <input
                            type="radio"
                            value={t.id}
                            {...register('enquiry_type')}
                            className="text-gold-600 focus:ring-gold-500"
                          />
                          <span className="font-semibold text-slate-700">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anand Patil"
                      {...register('customer_name')}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                    />
                    {errors.customer_name && (
                      <p className="mt-1 text-xs text-red-600">{errors.customer_name.message}</p>
                    )}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        {...register('phone')}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        {...register('email')}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Location & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hadapsar, Gadital, Magarpatta"
                        {...register('preferred_location')}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Estimated Budget
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹60 - 80 Lakh or ₹25,000/mo"
                        {...register('budget')}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message or Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please let us know how we can assist you..."
                      {...register('message')}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all resize-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-900/60 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                          <span>Sending Your Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-gold-400" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
