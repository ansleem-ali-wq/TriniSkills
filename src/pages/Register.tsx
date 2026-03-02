import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Wrench } from 'lucide-react'
import { motion } from 'motion/react'

export function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) throw error

      if (data.user) {
        navigate('/profile')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-indigo-500/5 border border-zinc-100"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 shadow-inner border border-indigo-100/50">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 tracking-tight">Join as a Pro</h1>
          <p className="text-zinc-500 mt-3 text-sm sm:text-base">Create an account to list your skills and get hired by locals.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-zinc-900">Email Address</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="bg-zinc-50/50"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-zinc-900">Password</label>
            <Input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              minLength={6}
              className="bg-zinc-50/50"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base rounded-xl mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 hover:underline font-semibold transition-colors">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
