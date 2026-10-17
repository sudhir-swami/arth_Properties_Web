import { PropertyType, FurnishingStatus, TransactionType } from '@/types';

/**
 * Formats a number into Indian Rupees (INR) format.
 * Examples:
 * Buy: 8800000 -> "₹88 Lakh" (or "₹88,00,000")
 * Buy: 21000000 -> "₹2.10 Cr"
 * Rent: 22000 -> "₹22,000 / mo"
 */
export function formatPrice(
  amount: number,
  transactionType: TransactionType = 'buy',
  compact: boolean = true
): string {
  if (!amount || amount === 0) return 'Price on Request';

  if (transactionType === 'rent') {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted} / mo`;
  }

  if (compact) {
    if (amount >= 10000000) {
      const cr = amount / 10000000;
      return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats floor area with comma grouping
 */
export function formatArea(area: number, unit: string = 'sq.ft'): string {
  if (!area) return 'N/A';
  return `${new Intl.NumberFormat('en-IN').format(area)} ${unit}`;
}

/**
 * Converts property types to user-friendly titles
 */
export function formatPropertyType(type: PropertyType): string {
  const map: Record<PropertyType, string> = {
    apartment: 'Apartment / Flat',
    independent_house: 'Independent House',
    villa: 'Villa / Bungalow',
    plot: 'Residential Plot',
    commercial_shop: 'Commercial Shop',
    office: 'Commercial Office',
  };
  return map[type] || type;
}

/**
 * Formats furnishing status
 */
export function formatFurnishing(status: FurnishingStatus | null): string {
  if (!status) return 'Not Specified';
  const map: Record<FurnishingStatus, string> = {
    unfurnished: 'Unfurnished',
    'semi-furnished': 'Semi-Furnished',
    'fully-furnished': 'Fully Furnished',
  };
  return map[status] || status;
}

/**
 * Generates an SEO-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

/**
 * Generates official WhatsApp click-to-chat URL
 * Using international format: +91 96899 65655 -> 919689965655
 */
export function getWhatsAppLink(phone: string = '+919689965655', message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
