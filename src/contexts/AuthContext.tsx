import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { auth, db } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  tokens: number
  subscription_tier: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateTokens: (tokens: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (!user) return
    
    const { data, error } = await db.getUserProfile(user.id)
    if (!error && data) {
      setProfile(data)
    }
  }

  const updateTokens = async (tokens: number) => {
    if (!user) return
    
    const { data, error } = await db.updateUserTokens(user.id, tokens)
    if (!error && data) {
      setProfile(prev => prev ? { ...prev, tokens: data.tokens } : null)
    }
  }

  useEffect(() => {
    // Get initial session
    auth.getCurrentUser().then(({ user }) => {
      setUser(user)
      if (user) {
        refreshProfile()
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await refreshProfile()
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await auth.signUp(email, password, firstName, lastName)
    
    if (error) {
      return { error }
    }
    
    // If signup successful and user is created, create profile
    if (data.user) {
      try {
        // Create user profile in database
        const { error: profileError } = await db.createUserProfile({
          id: data.user.id,
          email: data.user.email!,
          first_name: firstName,
          last_name: lastName
        })
        
        if (profileError) {
          console.error('Failed to create user profile:', profileError)
          return { error: { message: 'Account created but profile setup failed. Please contact support.' } }
        }
      } catch (profileError) {
        console.error('Profile creation error:', profileError)
        return { error: { message: 'Account created but profile setup failed. Please contact support.' } }
      }
    }
    
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await auth.signIn(email, password)
    
    if (error) {
      return { error }
    }
    
    // Check if user profile exists in database
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await db.getUserProfile(data.user.id)
        
        if (profileError || !profile) {
          // Sign out the user since they don't have a profile
          await auth.signOut()
          return { 
            error: { 
              message: 'No account found. Please sign up first or contact support if you believe this is an error.' 
            } 
          }
        }
      } catch (profileError) {
        console.error('Profile check error:', profileError)
        await auth.signOut()
        return { 
          error: { 
            message: 'Unable to verify account. Please try again or contact support.' 
          } 
        }
      }
    }
    
    return { error: null }
  }

  const signOut = async () => {
    await auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    updateTokens
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}