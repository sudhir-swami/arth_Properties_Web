import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, PropertyFormData } from '@/utils/validation';
import { Property, PropertyType, TransactionType, FurnishingStatus, PropertyStatus } from '@/types';
import { propertyService } from '@/services/propertyService';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Upload,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

interface ImageItem {
  id: string;
  image_url: string;
  storage_path?: string | null;
  is_cover: boolean;
  sort_order: number;
  file?: File;
}

interface PropertyFormProps {
  initialProperty?: Property;
  onSubmit: (data: PropertyFormData, images: ImageItem[]) => Promise<void>;
  isLoading: boolean;
}

const COMMON_AMENITIES = [
  'Lift',
  'Covered Parking',
  '24x7 Security',
  'Power Backup',
  'Club House',
  'Gymnasium',
  'Children Play Area',
  'Rainwater Harvesting',
  'Piped Gas',
  'Swimming Pool',
  'Private Garden',
  'Terrace Deck',
  'Central AC',
  'Main Road Facing',
  'Visitor Parking',
  'CCTV Surveillance',
];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialProperty,
  onSubmit,
  isLoading,
}) => {
  // Existing images or demo images
  const [images, setImages] = useState<ImageItem[]>(
    initialProperty?.images && initialProperty.images.length > 0
      ? initialProperty.images.map((img, idx) => ({
          id: img.id || `img-${idx}`,
          image_url: img.image_url,
          storage_path: img.storage_path,
          is_cover: img.is_cover,
          sort_order: img.sort_order ?? idx,
        }))
      : [
          {
            id: 'default-cover',
            image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            is_cover: true,
            sort_order: 0,
          },
        ]
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [customAmenity, setCustomAmenity] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialProperty?.title || '',
      description: initialProperty?.description || '',
      transaction_type: initialProperty?.transaction_type || 'buy',
      property_type: initialProperty?.property_type || 'apartment',
      price: initialProperty?.price ?? 0,
      monthly_rent: initialProperty?.monthly_rent ?? 0,
      location: initialProperty?.location || 'Hadapsar',
      address: initialProperty?.address || '',
      bedrooms: initialProperty?.bedrooms ?? 2,
      bathrooms: initialProperty?.bathrooms ?? 2,
      area: initialProperty?.area ?? 1000,
      area_unit: initialProperty?.area_unit || 'sq.ft',
      furnishing_status: initialProperty?.furnishing_status || 'semi-furnished',
      parking_available: initialProperty?.parking_available ?? true,
      amenities: initialProperty?.amenities || ['Lift', 'Covered Parking', '24x7 Security'],
      featured: initialProperty?.featured ?? false,
      status: initialProperty?.status || 'available',
      published: initialProperty?.published ?? true,
    },
  });

  const selectedAmenities = watch('amenities') || [];
  const currentTransactionType = watch('transaction_type');
  const currentPropertyType = watch('property_type');

  // Toggle amenity selection
  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setValue('amenities', selectedAmenities.filter((a) => a !== amenity));
    } else {
      setValue('amenities', [...selectedAmenities, amenity]);
    }
  };

  // Add custom amenity tag
  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setValue('amenities', [...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newItems: ImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate size
      if (file.size > 5 * 1024 * 1024) {
        setImageError(`File "${file.name}" exceeds 5MB limit.`);
        continue;
      }

      if (isSupabaseConfigured) {
        try {
          const res = await propertyService.uploadPropertyImage(file);
          newItems.push({
            id: 'storage-' + Date.now() + '-' + i,
            image_url: res.url,
            storage_path: res.path,
            is_cover: images.length === 0 && newItems.length === 0,
            sort_order: images.length + newItems.length,
          });
        } catch (err: any) {
          setImageError(err.message || 'Error uploading to Supabase Storage.');
        }
      } else {
        // Preview mode using object URL with notification
        const previewUrl = URL.createObjectURL(file);
        newItems.push({
          id: 'demo-upload-' + Date.now() + '-' + i,
          image_url: previewUrl,
          file,
          is_cover: images.length === 0 && newItems.length === 0,
          sort_order: images.length + newItems.length,
        });
      }
    }

    setImages((prev) => [...prev, ...newItems]);
    setUploadingImage(false);
  };

  // Add image via direct URL
  const [manualUrl, setManualUrl] = useState('');
  const handleAddImageUrl = () => {
    if (manualUrl.trim()) {
      setImages((prev) => [
        ...prev,
        {
          id: 'manual-' + Date.now(),
          image_url: manualUrl.trim(),
          is_cover: prev.length === 0,
          sort_order: prev.length,
        },
      ]);
      setManualUrl('');
    }
  };

  const handleSetCover = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_cover: idx === index,
      }))
    );
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      // Ensure at least one is cover if any remain
      if (next.length > 0 && !next.some((img) => img.is_cover)) {
        next[0].is_cover = true;
      }
      return next.map((img, idx) => ({ ...img, sort_order: idx }));
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy.map((img, idx) => ({ ...img, sort_order: idx }));
    });
  };

  const handleFormSubmit = (data: PropertyFormData) => {
    if (images.length === 0) {
      setImageError('Please provide at least one property photograph.');
      return;
    }
    onSubmit(data, images);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* 1. Basic Information Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
          1. Basic Listing Information
        </h2>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Property Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Premium 3 BHK Luxury Apartment in Hadapsar"
            {...register('title')}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none transition-all"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* Transaction Type & Property Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Transaction Type
            </label>
            <select
              {...register('transaction_type')}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
            >
              <option value="buy">For Sale (Buy)</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Property Category
            </label>
            <select
              {...register('property_type')}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
            >
              <option value="apartment">Apartment / Flat</option>
              <option value="independent_house">Independent House</option>
              <option value="villa">Villa / Bungalow</option>
              <option value="plot">Residential Plot</option>
              <option value="commercial_shop">Commercial Shop</option>
              <option value="office">Commercial Office</option>
            </select>
          </div>
        </div>

        {/* Pricing Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentTransactionType === 'buy' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price (in ₹ INR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 8800000"
                {...register('price')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Enter full numeric amount (e.g. 88 Lakh = 8800000)
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Monthly Rent (in ₹ INR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 22000"
                {...register('monthly_rent')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Monthly rental rate in ₹
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Locality (City District) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hadapsar, Gadital, Magarpatta"
              {...register('location')}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
            />
            {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Exact Property Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Near Siddhi Driving School, Unnati Nagar, Hadapsar, Pune 411028"
            {...register('address')}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
          />
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Provide architectural highlights, connectivity details, society specifications..."
            {...register('description')}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none resize-none"
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
        </div>
      </div>

      {/* 2. Specifications & Dimensions Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
          2. Specifications & Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Built-Up Area <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 1450"
              {...register('area')}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
            />
            {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Area Unit
            </label>
            <input
              type="text"
              {...register('area_unit')}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Furnishing
            </label>
            <select
              {...register('furnishing_status')}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
            >
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="fully-furnished">Fully Furnished</option>
            </select>
          </div>
        </div>

        {/* Bedrooms & Bathrooms (Only relevant for residential categories) */}
        {!['plot', 'commercial_shop', 'office'].includes(currentPropertyType) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bedrooms (BHK)
              </label>
              <input
                type="number"
                placeholder="e.g. 3"
                {...register('bedrooms')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bathrooms
              </label>
              <input
                type="number"
                placeholder="e.g. 2"
                {...register('bathrooms')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-gold-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Checkbox toggles: Parking, Featured, Published, Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              {...register('parking_available')}
              className="w-4 h-4 text-gold-600 rounded"
            />
            <span className="text-xs font-bold text-slate-800">Parking Available</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              {...register('featured')}
              className="w-4 h-4 text-gold-600 rounded"
            />
            <span className="text-xs font-bold text-slate-800">Featured Listing</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              {...register('published')}
              className="w-4 h-4 text-gold-600 rounded"
            />
            <span className="text-xs font-bold text-slate-800">Published (Visible)</span>
          </label>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Availability Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
            >
              <option value="available">Available</option>
              <option value="under_offer">Under Offer</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Amenities Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
          3. Amenities & Features
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {COMMON_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <button
                type="button"
                key={amenity}
                onClick={() => handleToggleAmenity(amenity)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                  isChecked
                    ? 'border-navy-900 bg-navy-900 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{amenity}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-gold-400" />}
              </button>
            );
          })}
        </div>

        {/* Add custom amenity */}
        <div className="pt-2 flex items-center gap-2 max-w-md">
          <input
            type="text"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder="Add custom amenity..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustomAmenity}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* 4. Image Upload & Gallery Card (Section 10) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-900">
              4. Photographs & Image Gallery
            </h2>
            <p className="text-xs text-slate-500">
              Upload multiple images or paste URLs. Mark one image as cover.
            </p>
          </div>
          <span className="text-xs font-bold text-gold-700 px-2.5 py-1 bg-gold-50 rounded-lg">
            {images.length} images added
          </span>
        </div>

        {imageError && (
          <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{imageError}</span>
          </div>
        )}

        {/* Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File input (Supabase Storage) */}
          <div className="border-2 border-dashed border-slate-300 hover:border-gold-500 rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              disabled={uploadingImage}
              id="file-upload"
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              {uploadingImage ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-2" />
                  <span className="text-xs font-bold text-slate-700">Uploading to Supabase Storage...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gold-600 mb-2" />
                  <span className="text-xs font-bold text-navy-900 block">Choose Images from Computer</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, WebP up to 5MB each</span>
                </div>
              )}
            </label>
          </div>

          {/* Direct URL input */}
          <div className="border border-slate-200 rounded-2xl p-6 flex flex-col justify-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Or Add by Image URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800"
              >
                Add URL
              </button>
            </div>
          </div>
        </div>

        {/* Image Grid with Cover Tag and Reordering */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`relative rounded-2xl overflow-hidden border-2 bg-slate-100 group shadow-sm ${
                  img.is_cover ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-slate-200'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Cover badge */}
                {img.is_cover && (
                  <span className="absolute top-2 left-2 bg-gold-500 text-navy-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                    Cover Image
                  </span>
                )}

                {/* Action buttons overlay */}
                <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                        img.is_cover
                          ? 'bg-gold-500 text-navy-950'
                          : 'bg-white/20 text-white hover:bg-white/40'
                      }`}
                      title="Set as Cover"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(idx)}
                      className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reordering */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, 'left')}
                      className="p-1.5 rounded-lg bg-white/20 text-white disabled:opacity-30 hover:bg-white/40"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-white font-bold">#{idx + 1}</span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveImage(idx, 'right')}
                      className="p-1.5 rounded-lg bg-white/20 text-white disabled:opacity-30 hover:bg-white/40"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
              <span>Saving Property to Supabase...</span>
            </>
          ) : (
            <span>{initialProperty ? 'Update Property Listing' : 'Publish New Property Listing'}</span>
          )}
        </button>
      </div>
    </form>
  );
};
