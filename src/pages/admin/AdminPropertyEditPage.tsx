import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { PropertyFormData } from '@/utils/validation';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export const AdminPropertyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    propertyService
      .getPropertyById(id)
      .then((data) => {
        setProperty(data);
        setFetching(false);
      })
      .catch((err) => {
        console.error('Error loading property for edit:', err);
        setFetching(false);
      });
  }, [id]);

  const handleSubmit = async (data: PropertyFormData, images: any[]) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      await propertyService.updateProperty(
        id,
        {
          title: data.title,
          description: data.description,
          transaction_type: data.transaction_type,
          property_type: data.property_type,
          price: data.price,
          monthly_rent: data.monthly_rent,
          location: data.location,
          address: data.address,
          bedrooms: data.bedrooms ?? null,
          bathrooms: data.bathrooms ?? null,
          area: data.area,
          area_unit: data.area_unit,
          furnishing_status: data.furnishing_status ?? null,
          parking_available: data.parking_available,
          amenities: data.amenities,
          featured: data.featured,
          status: data.status,
          published: data.published,
        },
        images.map((img, idx) => ({
          image_url: img.image_url,
          storage_path: img.storage_path,
          is_cover: img.is_cover,
          sort_order: idx,
        }))
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/properties');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to update property:', err);
      setError(err.message || 'Error updating property.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-500 mb-2" />
        <p className="text-xs text-slate-500">Loading property record...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-bold text-navy-900 mb-2">Property Not Found</p>
        <Link to="/admin/properties" className="text-xs text-gold-700 underline">
          Return to properties list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Return button */}
      <div>
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Properties</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Edit Property Listing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Updating: {property.title.replace(/^\[DEMO\]\s*/i, '')}
          </p>
        </div>

        <Link
          to={`/properties/${property.slug}`}
          target="_blank"
          className="text-xs font-bold text-navy-900 hover:text-gold-700 underline"
        >
          View Live Page ↗
        </Link>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Property updated successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Property Form */}
      <PropertyForm
        initialProperty={property}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
};
