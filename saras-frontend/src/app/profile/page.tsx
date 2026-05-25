"use client"

import React, { useState, useEffect } from 'react'
import { Topbar } from "@/components/layout/Topbar"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/toast"
import { User, RefreshCw, Save } from 'lucide-react'

const PRESET_SEEDS = [
  "Anya", "Budi", "Chandra", "Dewi", "Eko", "Fitri"
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [username, setUsername] = useState("")
  const [seed, setSeed] = useState("Anya")
  const [error, setError] = useState("")

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUsername = localStorage.getItem("saras_username") || ""
      const savedSeed = localStorage.getItem("saras_avatar_seed") || "Anya"
      setUsername(savedUsername)
      setSeed(savedSeed)
    }
  }, [])

  const handleAcakAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8)
    setSeed(randomSeed)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: 3-20 chars, alphanumeric + underscore
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(username)) {
      setError("Username harus 3-20 karakter dan hanya berisi huruf, angka, atau underscore (_).")
      toast({
        type: 'error',
        title: 'Gagal Menyimpan',
        description: 'Format username tidak valid.'
      })
      return
    }

    setError("")
    if (typeof window !== "undefined") {
      localStorage.setItem("saras_username", username)
      localStorage.setItem("saras_avatar_seed", seed)
    }

    toast({
      type: 'success',
      title: 'Profil Tersimpan!',
      description: 'Username dan avatar Anda berhasil diperbarui.'
    })
  }

  const avatarUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background">
      <Topbar title="Profil Pengguna" subtitle="Pengaturan Identitas & Kredensial Akademik" />
      
      <div className="max-w-4xl p-6 space-y-8">
        
        {/* Profile Card Container */}
        <div className="border-4 border-foreground bg-white p-6 md:p-8 neo-shadow relative">
          <div className="absolute top-0 right-0 bg-yellow-200 border-b-4 border-l-4 border-foreground px-4 py-2 font-black text-xs uppercase tracking-wider">
            Akun Terverifikasi
          </div>

          <h2 className="text-2xl font-black uppercase text-foreground mb-6 flex items-center gap-2">
            <User className="h-6 w-6" /> Identitas Akademik
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Avatar Selector Column */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 border-4 border-foreground bg-yellow-100 neo-shadow overflow-hidden flex items-center justify-center p-2 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={handleAcakAvatar}
                className="flex items-center gap-2 border-2 border-foreground bg-primary px-4 py-2 font-black text-sm uppercase tracking-wide hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all neo-shadow-sm text-foreground rounded-none"
              >
                <RefreshCw className="h-4 w-4" /> Acak Avatar
              </button>

              <div className="w-full mt-4">
                <p className="font-black text-xs uppercase tracking-wider text-muted-foreground mb-2 text-center">Preset Avatar</p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_SEEDS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeed(s)}
                      className={`border-2 border-foreground p-1 hover:-translate-y-[1px] transition-all rounded-none ${seed === s ? 'bg-yellow-200 neo-shadow-sm' : 'bg-background hover:bg-yellow-50'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://api.dicebear.com/9.x/shapes/svg?seed=${s}`} 
                        alt={s} 
                        className="w-10 h-10 mx-auto"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fields Column */}
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block font-black text-sm uppercase tracking-wider text-foreground mb-2">Email Terdaftar</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || "angga@ui.ac.id"}
                    className="border-2 border-foreground bg-gray-100 text-gray-500 px-4 py-2 font-medium w-full rounded-none cursor-not-allowed outline-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Kredensial email disinkronkan via Firebase Auth.</p>
                </div>

                <div>
                  <label className="block font-black text-sm uppercase tracking-wider text-foreground mb-2">Username Saras</label>
                  <div className="flex">
                    <span className="bg-purple-200 border-2 border-r-0 border-foreground px-3 py-2 font-black text-sm uppercase flex items-center neo-shadow-sm">
                      saras.id/
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      placeholder="username"
                      className="border-2 border-foreground bg-background px-4 py-2 font-bold focus:outline-none focus:bg-amber-50 neo-shadow-sm rounded-none w-full text-foreground"
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm font-bold text-red-600 uppercase tracking-wide">{error}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">Username ini akan muncul sebagai pembuat survey di platform VERA.</p>
                </div>

                <div className="pt-4 border-t-2 border-foreground flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 border-2 border-foreground bg-green-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all px-6 py-3 font-black text-sm uppercase tracking-wider neo-shadow rounded-none text-foreground"
                  >
                    <Save className="h-5 w-5" /> Simpan Profil
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

        {/* Info card */}
        <div className="border-4 border-foreground bg-blue-100 p-6 neo-shadow rounded-none">
          <h3 className="font-black text-lg uppercase text-blue-900 mb-2">💡 Tips Profil Neobrutalism</h3>
          <p className="text-sm text-blue-800 leading-relaxed font-semibold">
            Tampilan profil Anda menggunakan generator avatar DiceBear Shapes dengan skema neobrutalisme datar dan berbayang kuat. Username Anda digunakan untuk melacak kontribusi dan validasi responden di platform SARAS secara transparan.
          </p>
        </div>

      </div>
    </div>
  )
}
