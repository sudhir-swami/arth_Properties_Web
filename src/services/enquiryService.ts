import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Enquiry, EnquiryStatus } from '@/types';
import { EnquiryFormData } from '@/utils/validation';

// Local mock enquiries for demonstration preview
let localEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    customer_name: 'Rahul Deshmukh',
    phone: '+91 98220 12345',
    email: 'rahul.d@example.com',
    enquiry_type: 'property_enquiry',
    property_id: '11111111-1111-1111-1111-111111111111',
    preferred_location: 'Hadapsar',
    budget: '₹85 - 90 Lakh',
    message: 'Interested in the 3 BHK Luxury Apartment in Hadapsar. Want to check floor plan and schedule visit.',
    status: 'new',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    property: {
      id: '11111111-1111-1111-1111-111111111111',
      title: '[DEMO] Premium 3 BHK Luxury Apartment in Hadapsar',
      slug: 'demo-premium-3-bhk-luxury-apartment-hadapsar',
      price: 8800000,
      location: 'Hadapsar',
    },
  },
  {
    id: 'enq-2',
    customer_name: 'Pooja Kulkarni',
    phone: '+91 97654 32100',
    email: 'pooja.k@example.com',
    enquiry_type: 'callback',
    property_id: '22222222-2222-2222-2222-222222222222',
    preferred_location: 'Gadital',
    budget: '₹20,000 / mo',
    message: 'Please call me regarding 2 BHK flat for rent near Gadital. Looking for immediate possession.',
    status: 'contacted',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    property: {
      id: '22222222-2222-2222-2222-222222222222',
      title: '[DEMO] Modern 2 BHK Flat for Rent near Gadital',
      slug: 'demo-modern-2-bhk-flat-rent-gadital',
      price: 22000,
      location: 'Gadital',
    },
  },
  {
    id: 'enq-3',
    customer_name: 'Amitabh Shinde',
    phone: '+91 94220 98765',
    email: '',
    enquiry_type: 'site_visit',
    property_id: '33333333-3333-3333-3333-333333333333',
    preferred_location: 'Pune-Solapur Highway',
    budget: '₹75 Lakh',
    message: 'Want to arrange a site visit this Saturday for the commercial showroom on Solapur highway.',
    status: 'follow_up',
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    property: {
      id: '33333333-3333-3333-3333-333333333333',
      title: '[DEMO] Prime Commercial Showroom on Pune-Solapur Highway',
      slug: 'demo-prime-commercial-showroom-pune-solapur-highway',
      price: 7500000,
      location: 'Hadapsar',
    },
  },
];

export const enquiryService = {
  /**
   * Submit new enquiry from public customer form
   */
  async submitEnquiry(data: EnquiryFormData): Promise<{ success: boolean; id: string; message: string }> {
    const payload = {
      customer_name: data.customer_name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      enquiry_type: data.enquiry_type,
      property_id: data.property_id || null,
      preferred_location: data.preferred_location?.trim() || null,
      budget: data.budget?.trim() || null,
      message: data.message.trim(),
      status: 'new' as EnquiryStatus,
    };

    if (!isSupabaseConfigured) {
      const newEnquiry: Enquiry = {
        ...payload,
        id: 'demo-enq-' + Date.now(),
        created_at: new Date().toISOString(),
      };
      localEnquiries.unshift(newEnquiry);
      return {
        success: true,
        id: newEnquiry.id,
        message: 'Your enquiry has been received successfully! Our team at Arth Properties will contact you shortly.',
      };
    }

    const { error } = await supabase
      .from('enquiries')
      .insert(payload);

    if (error) {
      console.error('Error submitting enquiry to Supabase:', error);
      throw error;
    }

    return {
      success: true,
      id: 'submitted',
      message: 'Your enquiry has been submitted successfully! Our team at Arth Properties will reach out soon.',
    };
  },

  /**
   * Admin: Fetch all enquiries with optional status filter
   */
  async getEnquiries(statusFilter?: EnquiryStatus | 'all'): Promise<Enquiry[]> {
    if (!isSupabaseConfigured) {
      if (statusFilter && statusFilter !== 'all') {
        return localEnquiries.filter((e) => e.status === statusFilter);
      }
      return [...localEnquiries];
    }

    let query = supabase
      .from('enquiries')
      .select('*, property:properties(id, title, slug, price, location)')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching enquiries:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Admin: Update enquiry status
   */
  async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
    if (!isSupabaseConfigured) {
      const found = localEnquiries.find((e) => e.id === id);
      if (found) found.status = status;
      return;
    }

    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Admin: Delete enquiry
   */
  async deleteEnquiry(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      localEnquiries = localEnquiries.filter((e) => e.id !== id);
      return;
    }

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
