import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Search, MapPin, Phone, User as UserIcon, Briefcase, ChevronDown, Award, Globe, Star, X, MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'

interface Profile {
  id: string
  full_name: string
  skill_category: string
  location: string
  phone: string
  bio: string
  media_urls?: string[]
  badge?: 'gold' | 'silver' | 'bronze' | null
  is_web_sourced?: boolean
}

interface Review {
  id: string
  profile_id: string
  rating: number
  comment: string
  created_at: string
}

const CATEGORIES = [
  "All Categories",
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
  "All Locations",
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

export function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [locationFilter, setLocationFilter] = useState('All Locations')
  const [error, setError] = useState<string | null>(null)

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    fetchProfilesAndReviews()
  }, [])

  async function fetchProfilesAndReviews() {
    try {
      setLoading(true)
      const [profilesResponse, reviewsResponse] = await Promise.all([
        supabase.from('profiles').select('*').order('full_name'),
        supabase.from('reviews').select('*').order('created_at', { ascending: false })
      ])

      if (profilesResponse.error) {
        throw profilesResponse.error
      }

      if (reviewsResponse.error && reviewsResponse.error.code !== '42P01') {
        console.error('Error fetching reviews:', reviewsResponse.error)
      }

      setProfiles(profilesResponse.data || [])
      setReviews(reviewsResponse.data || [])
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProfile || reviewForm.rating === 0) return

    setSubmittingReview(true)
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            profile_id: selectedProfile.id,
            rating: reviewForm.rating,
            comment: reviewForm.comment
          }
        ])
        .select()

      if (error) throw error

      if (data) {
        setReviews([data[0], ...reviews])
        setReviewForm({ rating: 0, comment: '' })
      }
    } catch (err: any) {
      console.error('Error submitting review:', err)
      alert(`Failed to submit review: ${err.message}`)
    } finally {
      setSubmittingReview(false)
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          profile.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All Categories' || profile.skill_category === categoryFilter
    const matchesLocation = locationFilter === 'All Locations' || profile.location === locationFilter
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-900 text-white py-20 sm:py-32 rounded-b-[3rem] mb-12 px-4 sm:px-6 lg:px-8 max-w-[100vw]">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/trinidad/1920/1080?blur=10')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
              <Briefcase className="w-4 h-4" />
              Trinidad & Tobago's Pro Network
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-white leading-[1.1]">
              Find the right person <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                for the job.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              Connect with trusted local professionals for your next project. From plumbers to electricians, discover top talent in your area.
            </p>
          </motion.div>

          {/* Search Bar (Floating) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-4xl mx-auto mt-12 bg-white/10 backdrop-blur-xl p-2 sm:p-3 rounded-3xl border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-2 shadow-inner">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
                <input 
                  type="text"
                  placeholder="What service do you need?" 
                  className="w-full h-14 pl-12 pr-4 bg-transparent text-zinc-900 placeholder:text-zinc-400 focus:outline-none text-base sm:text-lg rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="h-px sm:h-auto sm:w-px bg-zinc-200 mx-2" />
              <div className="relative sm:w-48 flex items-center">
                <div className="absolute left-4 w-5 h-5 text-zinc-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select 
                  className="w-full h-14 pl-11 pr-8 bg-transparent text-zinc-900 focus:outline-none text-sm sm:text-base appearance-none cursor-pointer font-medium"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
              <div className="h-px sm:h-auto sm:w-px bg-zinc-200 mx-2" />
              <div className="relative sm:w-48 flex items-center">
                <div className="absolute left-4 w-5 h-5 text-zinc-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <select 
                  className="w-full h-14 pl-11 pr-8 bg-transparent text-zinc-900 focus:outline-none text-sm sm:text-base appearance-none cursor-pointer font-medium"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {error && (
          <div className="mb-8 bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 shadow-sm">
            <h3 className="font-display font-bold text-lg mb-1">Database Connection Error</h3>
            <p className="text-sm opacity-90">{error}</p>
            <p className="text-sm mt-3 font-medium">
              Note: The `profiles` table might not exist yet. Please create it in your Supabase dashboard.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-zinc-900">
            {loading ? 'Loading professionals...' : `${filteredProfiles.length} Professionals Found`}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => {
                const profileReviews = reviews.filter(r => r.profile_id === profile.id)
                const avgRating = profileReviews.length > 0 
                  ? profileReviews.reduce((sum, r) => sum + r.rating, 0) / profileReviews.length 
                  : 0

                return (
                <motion.div 
                  key={profile.id} 
                  variants={item}
                  className="group bg-white rounded-3xl border border-zinc-200/80 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-display font-bold text-2xl shadow-inner border border-indigo-100/50 shrink-0">
                          {profile.full_name?.charAt(0).toUpperCase() || <UserIcon className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display font-bold text-lg text-zinc-900 group-hover:text-indigo-600 transition-colors">
                              {profile.full_name || 'Anonymous'}
                            </h3>
                            {profile.badge && (
                              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                                profile.badge === 'gold' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                profile.badge === 'silver' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                                'bg-orange-100 text-orange-800 border border-orange-200'
                              }`}>
                                <Award className="w-3 h-3" />
                                <span className="capitalize">{profile.badge}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-600">
                              {profile.skill_category}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-medium text-zinc-700">
                                {avgRating > 0 ? avgRating.toFixed(1) : 'New'} 
                                <span className="text-zinc-400 font-normal ml-1">({profileReviews.length})</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {profile.is_web_sourced && (
                      <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100 w-fit">
                        <Globe className="w-3.5 h-3.5" />
                        Sourced from Web (Unclaimed)
                      </div>
                    )}

                    <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {profile.bio || 'No bio provided.'}
                    </p>

                    {profile.media_urls && profile.media_urls.length > 0 && (
                      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar">
                        {profile.media_urls.map((url, idx) => {
                          const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i)
                          return (
                            <div key={idx} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 snap-start">
                              {isVideo ? (
                                <video src={url} className="w-full h-full object-cover" />
                              ) : (
                                <img src={url} alt="Portfolio" className="w-full h-full object-cover" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    <div className="pt-6 border-t border-zinc-100 space-y-3 mt-auto">
                      <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-zinc-400" />
                        </div>
                        {profile.location || 'Location not specified'}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-indigo-500" />
                        </div>
                        {profile.phone ? (
                          <a href={`tel:${profile.phone}`} className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                            {profile.phone}
                          </a>
                        ) : (
                          'Phone not provided'
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedProfile(profile)}
                      className="mt-6 w-full py-2.5 bg-zinc-50 hover:bg-indigo-50 text-zinc-700 hover:text-indigo-600 text-sm font-semibold rounded-xl border border-zinc-200 hover:border-indigo-200 transition-colors flex items-center justify-center gap-2"
                    >
                      View & Rate Pro
                    </button>
                  </div>
                </motion.div>
              )})
            ) : (
              <motion.div variants={item} className="col-span-full text-center py-20 bg-white rounded-3xl border border-zinc-200 border-dashed">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-zinc-900 mb-2">No professionals found</h3>
                <p className="text-zinc-500 max-w-md mx-auto">We couldn't find anyone matching your current search criteria. Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Profile & Review Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setSelectedProfile(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-display font-bold text-3xl shadow-inner border border-indigo-100/50 shrink-0">
                  {selectedProfile.full_name?.charAt(0).toUpperCase() || <UserIcon className="w-8 h-8" />}
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-zinc-900">{selectedProfile.full_name}</h2>
                  <p className="text-zinc-500 font-medium">{selectedProfile.skill_category}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProfile(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Write a Review Form */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-display font-bold text-lg text-zinc-900 mb-4">Rate this Pro</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-50'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Comment (Optional)</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience working with this pro..."
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-y min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview || reviewForm.rating === 0}
                      className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Reviews */}
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-zinc-400" />
                  Client Reviews
                </h3>
                <div className="space-y-4">
                  {reviews.filter(r => r.profile_id === selectedProfile.id).length > 0 ? (
                    reviews.filter(r => r.profile_id === selectedProfile.id).map(review => (
                      <div key={review.id} className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`} 
                            />
                          ))}
                          <span className="text-xs text-zinc-400 ml-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-zinc-700 text-sm leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-zinc-100 border-dashed">
                      <p className="text-zinc-500 text-sm">No reviews yet. Be the first to rate this pro!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
