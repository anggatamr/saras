"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { 
  signInWithPopup, GoogleAuthProvider, 
  signOut, onAuthStateChanged, User 
} from 'firebase/auth'

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isAcademicEmail: boolean
}>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  isAcademicEmail: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const email = result.user.email || ''
      if (!email.endsWith('.ac.id') && !email.endsWith('.edu')) {
        await signOut(auth)
        alert("Akses ditolak: Hanya email akademik (.ac.id atau .edu) yang diizinkan untuk verifikasi.")
        throw new Error('Hanya email akademik (.ac.id / .edu) yang diizinkan.')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const isAcademicEmail = !!user && !!user.email && (user.email.endsWith('.ac.id') || user.email.endsWith('.edu'))

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout: () => signOut(auth), isAcademicEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
