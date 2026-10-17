import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ECOSISTEMA, LOGO_ACADEMY_CIRCULAR } from '@/config/sitio';

const LOGO_URL = LOGO_ACADEMY_CIRCULAR;

export default function Footer() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2B4A5F] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Logo & description */}
          <div className="md:col-span-2">
            <img src={LOGO_URL} alt="Delhos" className="h-14 object-contain mb-4" />
            <p className="text-white/60 text-sm max-w-md">
              Formación práctica y rigurosa en ciencia de datos, inteligencia artificial y analítica empresarial. Clases en vivo 100% online.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <button onClick={() => scrollToSection('quienes-somos')} className="hover:text-white transition-colors">
                  Quiénes Somos
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('cursos')} className="hover:text-white transition-colors">
                  Cursos
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Ecosistema: las otras páginas de Delhos, en el mismo dominio */}
          <div>
            <h4 className="font-semibold mb-4">Ecosistema Delhos</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <a href={ECOSISTEMA.delhos} className="hover:text-white transition-colors">
                  Delhos
                </a>
              </li>
              <li>
                <a href={ECOSISTEMA.dataventura} className="hover:text-white transition-colors">
                  Dataventura
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <Link to={createPageUrl('Contacto')} className="hover:text-white transition-colors">
                  Formulario de Contacto
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contacto@delhosacademy.cl" className="hover:text-white transition-colors">
                  contacto@delhosacademy.cl
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          © 2026 Delhos Academy. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}