import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // User profile operations
  createUserProfile: async (profile: {
    id: string
    email: string
    first_name: string
    last_name: string
  }) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        tokens: 1000, // Default tokens for new users
        subscription_tier: 'free' // Default tier
      })
      .select()
      .single()
    return { data, error }
  },

  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Generation operations
  createGeneration: async (generation: {
    user_id: string
    jewelry_type: string
    gender: string
    original_images: string[]
    generated_images: string[]
    settings: any
  }) => {
    const { data, error } = await supabase
      .from('generations')
      .insert(generation)
      .select()
      .single()
    return { data, error }
  },

  getUserGenerations: async (userId: string, limit = 50, offset = 0) => {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  },

  deleteGeneration: async (generationId: string, userId: string) => {
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', generationId)
      .eq('user_id', userId)
    return { error }
  },

  // Token operations
  getUserTokens: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('tokens')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateUserTokens: async (userId: string, tokens: number) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ tokens })
      .eq('id', userId)
      .select('tokens')
      .single()
    return { data, error }
  }
}