import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Wrench, Menu, X, User as UserIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-zinc-900">
              TriniSkills
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600' : 'text-zinc-600'}`}
            >
              Find Skills
            </Link>
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-zinc-200">
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === '/profile' ? 'text-indigo-600' : 'text-zinc-600'}`}
                >
                  My Profile
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="rounded-full">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-zinc-200">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full shadow-md shadow-indigo-600/20">Join as Pro</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2 text-zinc-600 hover:text-zinc-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-zinc-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              <Link 
                to="/" 
                className="block px-4 py-3 rounded-xl bg-zinc-50 text-zinc-900 font-medium"
              >
                Find Skills
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-3 rounded-xl bg-zinc-50 text-zinc-900 font-medium"
                  >
                    My Profile
                  </Link>
                  <Button variant="outline" className="w-full justify-center" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">Join as Pro</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-zinc-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-80">
            <Wrench className="w-5 h-5 text-zinc-400" />
            <span className="font-display font-semibold text-zinc-900">TriniSkills</span>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} TriniSkills Directory. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
