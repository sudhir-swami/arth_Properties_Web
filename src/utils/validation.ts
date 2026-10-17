import { z } from 'zod';

// Contact / Enquiry Form Schema
export const enquirySchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be less than 80 characters'),
  phone: z
    .string()
    .min(10, 'Please enter a valid 10-digit phone number')
    .regex(/^[6-9]\d{9}$|^(\+91[\-\s]?)?[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  enquiry_type: z.enum(['general', 'callback', 'site_visit', 'property_enquiry']),
  property_id: z.string().optional().nullable(),
  preferred_location: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

// Admin Login Schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Property Create/Edit Schema
export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  transaction_type: z.enum(['buy', 'rent']),
  property_type: z.enum(['apartment', 'independent_house', 'villa', 'plot', 'commercial_shop', 'office']),
  price: z.coerce.number().min(0).default(0),
  monthly_rent: z.coerce.number().min(0).default(0),
  location: z.string().min(2, 'Location is required (e.g. Hadapsar, Gadital)'),
  address: z.string().min(5, 'Address is required'),
  bedrooms: z.coerce.number().nullable().optional(),
  bathrooms: z.coerce.number().nullable().optional(),
  area: z.coerce.number().positive('Area must be greater than 0'),
  area_unit: z.string().default('sq.ft'),
  furnishing_status: z.enum(['unfurnished', 'semi-furnished', 'fully-furnished']).nullable().optional(),
  parking_available: z.boolean().default(false),
  amenities: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['available', 'under_offer', 'sold', 'rented']).default('available'),
  published: z.boolean().default(true),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// Site Settings Schema
export const siteSettingsSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  marathi_name: z.string().min(2, 'Marathi name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  whatsapp_number: z.string().min(10, 'WhatsApp number is required'),
  address: z.string().min(5, 'Address is required'),
  headline: z.string().min(5, 'Headline is required'),
  description: z.string().min(10, 'Description is required'),
  about_text: z.string().min(20, 'About text is required'),
  footer_text: z.string().min(10, 'Footer text is required'),
  service_locations: z.array(z.string()).min(1, 'At least one location is required'),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
