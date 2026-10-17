import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Clock, CheckCircle } from 'lucide-react';
import { abrirCorreo } from '@/lib/correo';
import { toast } from 'sonner';

// ===== EDITABLE: Información de contacto =====
const CONTACT_INFO = {
  title: "¿Tienes alguna pregunta?",
  subtitle: "Completa el formulario y te responderemos a la brevedad"
};

const COUNTRIES = [
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { code: '+53', name: 'Cuba', flag: '🇨🇺' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳' },
  { code: '+52', name: 'México', flag: '🇲🇽' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { code: '+507', name: 'Panamá', flag: '🇵🇦' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+51', name: 'Perú', flag: '🇵🇪' },
  { code: '+1-809', name: 'República Dominicana', flag: '🇩🇴' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+34', name: 'España', flag: '🇪🇸' },
];
// ============================================

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    countryCode: '+56',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      abrirCorreo(`Contacto web: ${formData.subject || 'Consulta general'}`, [
        ['Nombre', formData.name],
        ['Correo', formData.email],
        ['País', formData.country],
        ['Teléfono', formData.phone && `${formData.countryCode} ${formData.phone}`],
        ['Asunto', formData.subject],
        ['Mensaje', formData.message]
      ]);

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', country: '', countryCode: '+56', phone: '', subject: '', message: '' });
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="py-20 px-6 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3D59] mb-4">
            {CONTACT_INFO.title}
          </h2>
          <p className="text-slate-600 text-lg">
            {CONTACT_INFO.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Horario de Atención */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2B7CB3] to-[#1E3D59] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#1E3D59] text-lg">Horario</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Lunes - Viernes</span>
                  <span className="font-medium text-slate-800">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Sábado</span>
                  <span className="font-medium text-slate-800">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Domingo</span>
                  <span className="font-medium text-red-600">Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre completo *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Tu nombre"
                    className="rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="tu@email.com"
                    className="rounded-xl"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      País
                    </label>
                    <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Selecciona tu país" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono móvil
                    </label>
                    <div className="flex gap-2">
                      <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                        <SelectTrigger className="w-24 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="912345678"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Asunto
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="¿En qué podemos ayudarte?"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mensaje *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Cuéntanos más sobre tu consulta..."
                    rows={5}
                    className="rounded-xl"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#2B7CB3] to-[#1E3D59] hover:from-[#1E3D59] hover:to-[#2B7CB3] text-white rounded-xl py-6 text-base font-medium shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
            onClick={() => setSubmitted(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">¡Tu mensaje está listo!</h3>
              <p className="text-green-700 text-lg">Se abrió tu aplicación de correo con el mensaje. Envíalo y te responderemos dentro de las próximas 24 horas.</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}