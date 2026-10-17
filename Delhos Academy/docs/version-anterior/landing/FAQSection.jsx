import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: '¿Los cursos son en vivo o grabados?',
    answer: 'Todos nuestros cursos son 100% en vivo. Las clases son sincrónicas, lo que significa que podrás interactuar directamente con el instructor y tus compañeros en tiempo real. Además, todas las sesiones quedan grabadas para que puedas revisarlas cuando lo necesites y de donde quieras.'
  },
  {
    question: '¿Necesito conocimientos previos?',
    answer: 'Depende del curso. Tenemos programas desde nivel cero para principiantes absolutos, hasta cursos avanzados para quienes ya tienen experiencia. En la descripción de cada curso encontrarás los requisitos previos recomendados y el temario de contenidos.'
  },
  {
    question: '¿Cómo son las clases online?',
    answer: 'Las clases se realizan a través de plataformas de videoconferencia con herramientas interactivas. Cada sesión incluye teoría, ejercicios prácticos en vivo y tiempo para preguntas. Tendrás acceso a materiales, código y bases de datos para practicar.'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito y débito, transferencias bancarias y diversos medios de pago electrónico.'
  },
  {
    question: '¿Entregan certificado al finalizar?',
    answer: 'Sí, al completar satisfactoriamente cada curso recibirás un certificado digital que acredita tu formación en Delhos Academy. Este certificado incluye las horas de formación y competencias adquiridas.'
  },
  {
    question: '¿Qué horarios tienen las clases?',
    answer: 'Las clases se programan en horarios que faciliten la participación de estudiantes de diferentes países de habla hispana. Generalmente ofrecemos opciones de tarde y noche. Consulta el calendario de cada curso para ver los horarios específicos.'
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-slate-600">
            Resolvemos tus dudas sobre nuestros programas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border border-slate-200 rounded-xl px-6 data-[state=open]:border-[#4a90c2]/50 data-[state=open]:shadow-md transition-all"
              >
                <AccordionTrigger className="text-left text-[#1e3a5f] font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}