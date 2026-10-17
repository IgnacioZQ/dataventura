import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Award } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Formación estructurada',
    description: 'Rutas claras desde nivel inicial a avanzado, con programas diseñados para que avances sin perderte.'
  },
  {
    icon: Users,
    title: 'Clases en Vivo',
    description: 'Sesiones sincrónicas, preguntas en tiempo real y feedback directo sobre tus proyectos.'
  },
  {
    icon: BookOpen,
    title: 'Casos reales',
    description: 'Contenidos basados en datos reales del sector público y de empresas, para que lo que aprendes tenga impacto inmediato y de verdad.'
  },
  {
    icon: Award,
    title: 'Certificación profesional',
    description: 'Certificados que validan tus habilidades y fortalecen tu perfil en el mercado laboral.'
  }
];

export default function PathSection() {
  return (
    <section id="quienes-somos" className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">
            Tu camino hacia ser un profesional de{' '}
            <span className="text-[#4a90c2]">DATA</span>
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Te guiamos paso a paso desde cero hasta el dominio absoluto de la analítica y la ciencia de datos.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#4a90c2]/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4a90c2] to-[#1e3a5f] flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}