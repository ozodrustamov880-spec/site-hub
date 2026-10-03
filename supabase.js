// ====================================================================
// SITEHUB - SUPABASE CLIENT CONFIGURATION
// ====================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// O'zingizning Supabase loyihangizdan URL va ANON KEY larni shu yerga qo'ying:
export const SUPABASE_URL = 'SIZNING_PROJECT_URL';
export const SUPABASE_ANON_KEY = 'SIZNING_ANON_KEY';

export const isConfigured = () => {
    return SUPABASE_URL && 
           SUPABASE_URL !== 'SIZNING_PROJECT_URL' && 
           SUPABASE_ANON_KEY && 
           SUPABASE_ANON_KEY !== 'SIZNING_ANON_KEY';
};

export const supabase = isConfigured() 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
    : null;

// Global oynaga ham biriktiramiz
if (typeof window !== 'undefined') {
    window.sitehubSupabase = supabase;
    window.isSupabaseConfigured = isConfigured;
}
