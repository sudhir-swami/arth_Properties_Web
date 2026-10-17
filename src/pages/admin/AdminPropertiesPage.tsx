import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Property, PropertyType, TransactionType } from '@/types';
import { propertyService } from '@/services/propertyService';
import { formatPrice } from '@/utils/formatters';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export const AdminPropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteModalProp, setDeleteModalProp] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await propertyService.getProperties({}, true); // isAdmin=true to get published & unpublished
      setProperties(res.properties);
    } catch (err) {
      console.error('Error fetching admin properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await propertyService.togglePropertyPublished(id, !current);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: !current } : p))
      );
    } catch (err) {
      console.error('Error toggling published status:', err);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await propertyService.togglePropertyFeatured(id, !current);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
      );
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalProp) return;
    setIsDeleting(true);
    try {
      await propertyService.deleteProperty(deleteModalProp.id);
      setProperties((prev) => prev.filter((p) => p.id !== deleteModalProp.id));
      setDeleteModalProp(null);
    } catch (err) {
      console.error('Error deleting property:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.transaction_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Manage Property Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish, edit, mark as featured, or remove real estate listings
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-gold-400" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or locality..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <label className="text-xs text-slate-500 font-semibold">Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none"
          >
            <option value="all">All Types (Sale & Rent)</option>
            <option value="buy">For Sale Only</option>
            <option value="rent">For Rent Only</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-500 mb-2" />
            Loading listings...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No properties found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Price / Rent</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProperties.map((prop) => {
                  const cover =
                    prop.images?.find((img) => img.is_cover)?.image_url ||
                    prop.images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80';

                  return (
                    <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cover}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg shrink-0 bg-slate-100"
                          />
                          <div className="max-w-xs">
                            <span className="font-bold text-navy-900 block truncate">
                              {prop.title.replace(/^\[DEMO\]\s*/i, '')}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Slug: {prop.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Transaction */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prop.transaction_type === 'rent'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-navy-100 text-navy-900'
                          }`}
                        >
                          {prop.transaction_type}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-navy-900">
                        {formatPrice(
                          prop.transaction_type === 'rent' ? prop.monthly_rent : prop.price,
                          prop.transaction_type
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-slate-600">{prop.location}</td>

                      {/* Availability Status */}
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {prop.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prop.featured
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                          }`}
                          title="Toggle Featured"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(prop.id, prop.published)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prop.published
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                          title={prop.published ? 'Published (Click to Unpublish)' : 'Draft (Click to Publish)'}
                        >
                          {prop.published ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/properties/${prop.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/properties/${prop.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-gold-700 hover:bg-gold-50 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteModalProp(prop)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalProp && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-navy-900 text-center mb-2">
              Confirm Delete Property
            </h3>

            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-navy-900">
                "{deleteModalProp.title.replace(/^\[DEMO\]\s*/i, '')}"
              </strong>
              ? This action will remove all associated database records and photographs.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalProp(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
