import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';
import { LOGO_ACADEMY } from '@/config/sitio';

const LOGO_URL = LOGO_ACADEMY;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const { user, isLoadingAuth } = useAuth();

  useEffect(() => {
    const studentSession = localStorage.getItem('studentSession');
    const instructorSession = localStorage.getItem('instructorSession');
    if (studentSession) setSession({ type: 'student', page: 'StudentDashboard' });
    else if (instructorSession) setSession({ type: 'instructor', page: 'InstructorDashboard' });
    else if (!isLoadingAuth && user) {
      // Usuario Base44 autenticado sin sesión propia
      if (user.role === 'admin' || user.role === 'instructor') {
        setSession({ type: 'instructor', page: 'InstructorDashboard' });
      } else {
        setSession({ type: 'student', page: 'StudentDashboard' });
      }
    }
  }, [user, isLoadingAuth]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center">
            <img src={LOGO_URL} alt="Delhos Academy" className="h-12 md:h-14 object-contain" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative">
            <Link 
              to={createPageUrl('Nosotros')}
              className="text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              Quiénes Somos
            </Link>
            <Link 
              to={createPageUrl('Cursos')}
              className="text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              Cursos
            </Link>
            <Link 
              to={createPageUrl('Webinars')}
              className="text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              Webinars & Workshops
            </Link>
            <Link 
              to={createPageUrl('Contacto')}
              className="text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link to={createPageUrl(session.page)}>
                <Button className="bg-[#2B7CB3] hover:bg-[#1E3D59] text-white rounded-full px-6">
                  Mi Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to={createPageUrl('Acceso')}>
                  <Button variant="outline" className="border-[#1E3D59] text-[#1E3D59] rounded-full px-6">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to={createPageUrl('Cursos')}>
                  <Button className="bg-[#2B7CB3] hover:bg-[#1E3D59] text-white rounded-full px-6">
                    Ver cursos
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 mt-3">
            <div className="flex flex-col gap-4">
              <Link 
                to={createPageUrl('Nosotros')}
                className="text-slate-600 hover:text-[#1e3a5f] font-medium text-left py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quiénes Somos
              </Link>
              <Link 
                to={createPageUrl('Cursos')}
                className="text-slate-600 hover:text-[#1e3a5f] font-medium text-left py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cursos
              </Link>
              <Link 
                to={createPageUrl('Webinars')}
                className="text-slate-600 hover:text-[#1e3a5f] font-medium text-left py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Webinars & Workshops
              </Link>
              <Link 
                to={createPageUrl('Contacto')}
                className="text-slate-600 hover:text-[#1e3a5f] font-medium text-left py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              {session ? (
                <Link to={createPageUrl(session.page)} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-[#2B7CB3] hover:bg-[#1E3D59] text-white rounded-full w-full">
                    Mi Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link 
                    to={createPageUrl('Acceso')}
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full border-[#1E3D59] text-[#1E3D59] rounded-full">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link 
                    to={createPageUrl('Cursos')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="bg-[#2B7CB3] hover:bg-[#1E3D59] text-white rounded-full w-full">
                      Ver cursos
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}