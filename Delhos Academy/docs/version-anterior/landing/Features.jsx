import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code2, Users, Rocket, Database, LineChart } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Machine Learning',
    description: 'Desde regresión lineal hasta redes neuronales profundas. Domina los algoritmos que impulsan la IA.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Code2,
    title: 'Python & SQL',
    description: 'Las herramientas esenciales del data scientist. Pandas, NumPy, Scikit-learn y más.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Database,
    title: 'Big Data',
    description: 'Procesa millones de registros con Spark, Hadoop y arquitecturas cloud modernas.',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: LineChart,
    title: 'Visualización',
    description: 'Cuenta historias con datos. Matplotlib, Seaborn, Plotly y dashboards interactivos.',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: Users,
    title: 'Mentoría 1:1',
    description: 'Sesiones personalizadas con expertos que trabajan en las mejores empresas tech.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Rocket,
    title: 'Proyectos Reales',
    description: 'Construye un portfolio con datasets reales y problemas de la industria.',
    color: 'from-indigo-500 to-blue-500'
  }
];

export default function Features() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">
            Programa
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            Todo lo que necesitas
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            Un curriculum diseñado por data scientists senior para llevarte de cero a profesional
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}