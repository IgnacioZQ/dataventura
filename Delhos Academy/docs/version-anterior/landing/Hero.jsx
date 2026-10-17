import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// ============================================================
// CONTENIDO EDITABLE - Cambia los textos entre comillas
// ============================================================

// TÍTULO PRINCIPAL (2 líneas)
const TITULO_LINEA_1 = "Aprende Ciencia de Datos";
const TITULO_LINEA_2 = "con criterio y foco en resultados";

// DESCRIPCIÓN (debajo del título)
const DESCRIPCION = "Formación práctica y rigurosa en ciencia de datos, inteligencia artificial y analítica aplicada a problemas reales del sector público y privado.";
const DESCRIPCION_DESTACADA = "Clases en vivo 100% online con acompañamiento cercano.";

// TEXTOS DE BOTONES
const BOTON_PRINCIPAL = "Comenzar ahora";
const BOTON_SECUNDARIO = "Ver cursos";

// ESTADÍSTICAS (mini textos en la parte inferior)
const STAT_1 = "Profesionales de habla hispana";
const STAT_2 = "Alta satisfacción y clases aplicadas";
const STAT_3 = "Múltiples cursos orientados a tu carrera";

// TARJETA DE CLASES EN VIVO
const CARD_TITULO = "Clases en vivo";
const CARD_DESCRIPCION = "Interacción directa con instructores";

// INSIGNIA FLOTANTE
const BADGE_TEXTO = "100% Online";

// URL DE IMAGEN (puedes cambiarla por otra de Unsplash)
const IMAGEN_URL = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=500&fit=crop";

// ============================================================
// NO TOCAR EL CÓDIGO DE ABAJO
// ============================================================

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#4a90c2]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1e3a5f]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-[#1e3a5f]">{TITULO_LINEA_1}</span>
              <br />
              <span className="text-[#4a90c2]">{TITULO_LINEA_2}</span>
            </h1>
            
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
              {DESCRIPCION}
              <span className="font-semibold text-[#1e3a5f]"> {DESCRIPCION_DESTACADA}</span>
            </p>

            <div className="mt-8">
              <Link to={createPageUrl('Cursos')}>
                <Button 
                  size="lg"
                  className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white rounded-full px-8 py-6 text-base font-medium group"
                >
                  {BOTON_PRINCIPAL}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stats mini */}
            <div className="mt-12 flex gap-8">
              <div>
                <div className="text-sm text-slate-500">{STAT_1}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">{STAT_2}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">{STAT_3}</div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#1e3a5f]/20">
              <img 
                src={IMAGEN_URL}
                alt="Estudiantes aprendiendo"
                className="w-full h-auto object-cover"
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4a90c2]/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#4a90c2] animate-pulse" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1e3a5f]">{CARD_TITULO}</div>
                    <div className="text-sm text-slate-500">{CARD_DESCRIPCION}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-[#1e3a5f] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              {BADGE_TEXTO}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}