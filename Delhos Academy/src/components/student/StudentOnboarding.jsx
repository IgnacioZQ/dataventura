import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, MessageSquare, Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LOGO_ACADEMY } from '@/config/sitio';

const LOGO_URL = LOGO_ACADEMY;

const steps = [
  {
    icon: BookOpen,
    color: 'from-[#1E3A5F] to-[#2E6DB4]',
    title: '¡Bienvenido/a a Delhos Academy!',
    description: 'Tu espacio de aprendizaje en ciencia de datos e inteligencia artificial. Aquí tendrás todo lo que necesitas para avanzar en tu carrera.',
  },
  {
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
    title: 'Clases en vivo',
    description: 'Revisa tu horario de clases desde la sección "Horario". Recibirás el enlace de Meet/Zoom directamente en el dashboard.',
  },
  {
    icon: Trophy,
    color: 'from-orange-500 to-red-500',
    title: 'Puntos y logros',
    description: 'Ganas puntos por asistir a clases y entregar tareas. ¡Acumula rachas de asistencia para desbloquear insignias especiales!',
  },
  {
    icon: MessageSquare,
    color: 'from-[#1E3A5F] to-[#2E6DB4]',
    title: 'Foro y mensajería',
    description: 'Participa en el foro del curso y comunícate directamente con tu instructor desde la sección de mensajería.',
  },
];

export default function StudentOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('studentOnboardingDone', 'true');
      onComplete();
    }
  };

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header gradient */}
          <div className={`bg-gradient-to-br ${current.color} p-10 flex flex-col items-center`}>
            <img src={LOGO_URL} alt="Delhos" className="h-12 object-contain mb-6 brightness-0 invert opacity-90" />
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <Icon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-3 text-center">{current.title}</h2>
            <p className="text-slate-500 text-center leading-relaxed">{current.description}</p>

            {/* Step dots */}
            <div className="flex justify-center gap-2 mt-6 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === step ? 'w-6 bg-[#2E6DB4]' : i < step ? 'w-2 bg-emerald-400' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#2E6DB4] hover:opacity-90 text-white rounded-xl py-3 font-semibold text-base"
            >
              {step < steps.length - 1 ? (
                <>Siguiente <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>¡Comenzar! <CheckCircle className="w-4 h-4 ml-2" /></>
              )}
            </Button>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-full text-center text-slate-400 text-sm mt-3 hover:text-slate-600 transition-colors"
              >
                Anterior
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}