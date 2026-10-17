import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteSettingsSchema, SiteSettingsFormData } from '@/utils/validation';
import { settingsService } from '@/services/settingsService';
import { SiteSettings } from '@/types';
import {
  Save,
  Loader2,
  CheckCircle,
  Building,
  Phone,
  MapPin,
  FileText,
  Plus,
  X,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
  });

  const serviceLocations = watch('service_locations') || [];

  useEffect(() => {
    settingsService
      .getSettings()
      .then((data) => {
        reset({
          business_name: data.business_name,
          marathi_name: data.marathi_name,
          phone: data.phone,
          whatsapp_number: data.whatsapp_number,
          address: data.address,
          headline: data.headline,
          description: data.description,
          about_text: data.about_text,
          footer_text: data.footer_text,
          service_locations: data.service_locations,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching site settings:', err);
        setLoading(false);
      });
  }, [reset]);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocation.trim() && !serviceLocations.includes(newLocation.trim())) {
      setValue('service_locations', [...serviceLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    setValue(
      'service_locations',
      serviceLocations.filter((l) => l !== loc)
    );
  };

  const onSubmit = async (data: SiteSettingsFormData) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await settingsService.updateSettings(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setError(err.message || 'Error updating site settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-500 mb-2" />
        <p className="text-xs text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
          Website & Business Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage business address, contact numbers, homepage hero copy, and service coverage
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Site settings saved successfully in database!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-gold-600" />
            <span>Business Identity & Contact</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                {...register('business_name')}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
              {errors.business_name && (
                <p className="text-xs text-red-600 mt-1">{errors.business_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Marathi Name
              </label>
              <input
                type="text"
                {...register('marathi_name')}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
              {errors.marathi_name && (
                <p className="text-xs text-red-600 mt-1">{errors.marathi_name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                {...register('phone')}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                WhatsApp Number (International Format)
              </label>
              <input
                type="text"
                {...register('whatsapp_number')}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
              {errors.whatsapp_number && (
                <p className="text-xs text-red-600 mt-1">{errors.whatsapp_number.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Office Address
            </label>
            <input
              type="text"
              {...register('address')}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
            {errors.address && (
              <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* Homepage Copy */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gold-600" />
            <span>Homepage Copy & Content</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Headline
            </label>
            <input
              type="text"
              {...register('headline')}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
            {errors.headline && (
              <p className="text-xs text-red-600 mt-1">{errors.headline.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Description
            </label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              About Section Copy
            </label>
            <textarea
              rows={4}
              {...register('about_text')}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none resize-none"
            />
            {errors.about_text && (
              <p className="text-xs text-red-600 mt-1">{errors.about_text.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Footer Description
            </label>
            <textarea
              rows={2}
              {...register('footer_text')}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none resize-none"
            />
          </div>
        </div>

        {/* Service Locations Tags */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-600" />
            <span>Service Locations & Neighborhoods</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {serviceLocations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-navy-900 border border-slate-200"
              >
                <span>{loc}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(loc)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="e.g. Kondhwa, Viman Nagar"
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
            <button
              type="button"
              onClick={handleAddLocation}
              className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
