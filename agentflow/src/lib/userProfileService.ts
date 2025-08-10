import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface UserProfile {
  id: string;
  email: string;
  llm_provider: 'weev' | 'byok';
  created_at: string;
  updated_at: string;
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data as UserProfile;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
  userId: string,
  email: string,
  llmProvider: 'weev' | 'byok' = 'weev'
): Promise<UserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .upsert(
      {
        id: userId,
        email: email,
        llm_provider: llmProvider,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }

  return data as UserProfile;
}

/**
 * Update user's LLM provider preference
 */
export async function updateUserLLMProvider(
  userId: string,
  provider: 'weev' | 'byok'
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      llm_provider: provider,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating LLM provider:', error);
    return false;
  }

  return true;
}

/**
 * Update user's API key (encrypted)
 */
export async function updateUserApiKey(
  userId: string,
  apiKey: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      api_key: apiKey, // In a real implementation, this should be encrypted
      llm_provider: 'byok', // Automatically switch to BYOK when key is provided
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating API key:', error);
    return false;
  }

  return true;
}

/**
 * Get user's API key
 */
export async function getUserApiKey(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('api_key')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user API key:', error);
    return null;
  }

  return data.api_key || null;
}
