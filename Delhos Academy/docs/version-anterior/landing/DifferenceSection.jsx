import React from 'react';
import { motion } from 'framer-motion';
import { Target, BookCheck, Lightbulb } from 'lucide-react';

// ============================================================
// CONTENIDO EDITABLE - Cambia los textos entre comillas
// ============================================================

// TÍTULO PRINCIPAL
const TITULO = "Lo que hace distinta a Delhos Academy";

// DESCRIPCIÓN
const DESCRIPCION = "No vendemos atajos ni fórmulas mágicas. Te enseñamos a pensar con datos y a construir soluciones que funcionen en el mundo real.";

// URL DE IMAGEN (puedes cambiarla por otra de Unsplash)
const IMAGEN_URL = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=450&fit=crop";

// DIFERENCIADORES (puedes agregar o quitar)
const differences = [
  {
    icon: Target,
    title: 'Práctico de verdad',
    description: 'Talleres en vivo trabajando con datasets reales (sector público y empresas), no ejemplos artificiales.'
  },
  {
    icon: BookCheck,
    title: 'Rigurosamente diseñado',
    description: 'Metodología alineada a estándares de la industria moderna, pero aterrizada al contexto tecnológico actual.'
  },
  {
    icon: Lightbulb,
    title: 'Aplicable al día siguiente',
    description: 'Proyectos que puedes llevar directo a tu organización y sumar a tu portafolio profesional.'
  }
];

// ============================================================
// NO TOCAR EL CÓDIGO DE ABAJO
// ============================================================

export default function DifferenceSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              {TITULO}
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              {DESCRIPCION}
            </p>

            <div className="mt-10 space-y-6">
              {differences.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-[#4a90c2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-white/60 text-sm mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden">
              <img 
                src={IMAGEN_URL}
                alt="Equipo Delhos"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border-4 border-[#4a90c2]/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}