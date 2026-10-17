import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSettings } from '@/types';
import { DEFAULT_SITE_SETTINGS } from '@/lib/mockData';
import { SiteSettingsFormData } from '@/utils/validation';

let localSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

export const settingsService = {
  /**
   * Fetch site settings
   */
  async getSettings(): Promise<SiteSettings> {
    if (!isSupabaseConfigured) {
      return { ...localSettings };
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle();

    if (error) {
      console.warn('Could not fetch site settings from Supabase, using defaults:', error);
      return { ...DEFAULT_SITE_SETTINGS };
    }

    if (!data) {
      return { ...DEFAULT_SITE_SETTINGS };
    }

    return data as SiteSettings;
  },

  /**
   * Update site settings (Admin only)
   */
  async updateSettings(data: SiteSettingsFormData): Promise<SiteSettings> {
    if (!isSupabaseConfigured) {
      localSettings = {
        ...localSettings,
        ...data,
        updated_at: new Date().toISOString(),
      };
      return { ...localSettings };
    }

    const payload = {
      id: 'general',
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from('site_settings')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error updating site settings:', error);
      throw error;
    }

    return updated as SiteSettings;
  },
};
