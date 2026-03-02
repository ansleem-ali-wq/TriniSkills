import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { UserCircle, CheckCircle2, Upload, X, Image as ImageIcon, Film } from 'lucide-react'
import { motion } from 'motion/react'

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Masonry",
  "Painting",
  "Landscaping",
  "Cleaning",
  "Mechanic",
  "IT & Tech",
  "Tutoring",
  "Other"
]

const LOCATIONS = [
  "Port of Spain",
  "San Fernando",
  "Chaguanas",
  "Arima",
  "Point Fortin",
  "Diego Martin",
  "San Juan",
  "Couva",
  "Princes Town",
  "Penal",
  "Siparia",
  "Tobago",
  "Other"
]

export function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    skill_category: CATEGORIES[0],
    location: LOCATIONS[0],
    phone: '',
    bio: '',
    media_urls: [] as string[],
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [user, navigate])

  async function fetchProfile() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          skill_category: data.skill_category || CATEGORIES[0],
          location: data.location || LOCATIONS[0],
          phone: data.phone || '',
          bio: data.bio || '',
          media_urls: data.media_urls || [],
        })
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError(null)
      const files = e.target.files
      if (!files || files.length === 0) return

      const newUrls = [...formData.media_urls]

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user?.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath)
        newUrls.push(data.publicUrl)
      }

      setFormData({ ...formData, media_urls: newUrls })
    } catch (err: any) {
      setError(`Upload failed: ${err.message}. Make sure you created the 'portfolio' storage bucket and made it public.`)
    } finally {
      setUploading(false)
    }
  }

  const removeMedia = (index: number) => {
    const newUrls = [...formData.media_urls]
    newUrls.splice(index, 1)
    setFormData({ ...formData, media_urls: newUrls })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const updates = {
        id: user?.id,
        ...formData,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        navigate('/')
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-zinc-200/40 border border-zinc-100"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-8 border-b border-zinc-100">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100/50 shrink-0">
            <UserCircle className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-zinc-900 tracking-tight">Your Public Profile</h1>
            <p className="text-zinc-500 mt-2 text-sm sm:text-base">Update your information to help clients find and contact you.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
              <p className="font-semibold mb-1">Error saving profile</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-100 font-medium flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Profile updated successfully! Your changes are now live.
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-zinc-900">Full Name</label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. John Doe"
                className="bg-zinc-50/50"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-zinc-900">Phone Number</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 868-123-4567"
                className="bg-zinc-50/50"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-zinc-900">Primary Skill</label>
              <Select
                value={formData.skill_category}
                onChange={(e) => setFormData({ ...formData, skill_category: e.target.value })}
                className="bg-zinc-50/50"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-zinc-900">Location</label>
              <Select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-zinc-50/50"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-zinc-900">Bio / Description of Services</label>
            <Textarea
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Describe your experience, services offered, and what makes you stand out..."
              rows={6}
              className="bg-zinc-50/50"
            />
            <p className="text-xs text-zinc-500 mt-2">This is the first thing potential clients will read about you.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Portfolio Media</h3>
              <p className="text-sm text-zinc-500">Upload pictures and videos of your past work to stand out.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.media_urls.map((url, idx) => {
                const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i)
                return (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
                    {isVideo ? (
                      <video src={url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={url} alt="Portfolio item" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
              
              <label className="relative aspect-square rounded-xl border-2 border-dashed border-zinc-300 hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-zinc-400 group-hover:text-indigo-500 mb-2" />
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-indigo-600">Upload Media</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 flex justify-end">
            <Button type="submit" disabled={saving || uploading} size="lg" className="w-full sm:w-auto">
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
