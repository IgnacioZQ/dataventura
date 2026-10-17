import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/api/client';
import { toast } from 'sonner';
import { LOGO_ACADEMY } from '@/config/sitio';

export default function StudentMessages({ studentData }) {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    fileUrl: ''
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    loadInstructor();
  }, [studentData]);

  const loadInstructor = async () => {
    if (!studentData?.instructor_email) {
      setLoading(false);
      return;
    }

    try {
      const instructors = await api.entities.Instructor.filter({ 
        email: studentData.instructor_email 
      });
      if (instructors.length > 0) {
        setInstructor(instructors[0]);
      }
    } catch (error) {
      console.error('Error loading instructor:', error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      setFormData({...formData, fileUrl: file_url});
      toast.success('Archivo adjunto');
    } catch (error) {
      toast.error('Error al subir archivo');
    }
    setUploadingFile(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const emailBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1E3A5F 0%, #2E6DB4 100%); padding: 40px 20px; text-align: center; }
    .logo { height: 50px; filter: brightness(0) invert(1); }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .content h1 { color: #1E3A5F; font-size: 22px; margin-top: 0; }
    .message-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2E6DB4; }
    .sender-info { background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666666; font-size: 14px; border-top: 1px solid #e0e0e0; }
    .footer a { color: #2E6DB4; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${window.location.origin}${LOGO_ACADEMY}" alt="Delhos Academy" class="logo">
    </div>
    <div class="content">
      <h1>Mensaje de Estudiante</h1>
      <div class="sender-info">
        <p style="margin: 0;"><strong>De:</strong> ${studentData.name}</p>
        <p style="margin: 5px 0 0 0;"><strong>Email:</strong> ${studentData.email}</p>
      </div>
      <h2 style="color: #1E3A5F; font-size: 18px;">${formData.subject}</h2>
      <div class="message-box">
        ${formData.message.replace(/\n/g, '<br>')}
      </div>
      ${formData.fileUrl ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f0f0; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold; color: #1E3A5F; margin-bottom: 10px;">📎 Archivo adjunto:</p>
          <a href="${formData.fileUrl}" style="color: #2E6DB4; text-decoration: none; word-break: break-all;">${formData.fileUrl}</a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
      <p><strong>Delhos Data Science Academy</strong></p>
      <p>Formación práctica y rigurosa en ciencia de datos e inteligencia artificial</p>
      <p><a href="mailto:ignaciozamoraquiroz@gmail.com">ignaciozamoraquiroz@gmail.com</a></p>
      <p style="margin-top: 20px; color: #999999; font-size: 12px;">Este correo fue enviado desde la plataforma Delhos Academy</p>
    </div>
  </div>
</body>
</html>`;

      await api.integrations.Core.SendEmail({
        to: 'ignacio.zamora@mail.udp.cl',
        subject: `Mensaje de ${studentData.name}: ${formData.subject}`,
        body: emailBody
      });

      toast.success('Mensaje enviado', {
        description: 'Tu instructor recibirá tu mensaje por correo.'
      });

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFormData({ subject: '', message: '', fileUrl: '' });
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">No se encontró información del instructor</p>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">¡Mensaje enviado!</h2>
          <p className="text-slate-500">Tu instructor recibirá tu mensaje por correo electrónico.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Contactar Instructor</h1>
      <p className="text-slate-500 mb-6">Envía un mensaje a tu instructor</p>

      {/* Instructor Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-5 mb-6"
      >
        <div className="flex items-center gap-4">
          {instructor.profile_image ? (
            <img src={instructor.profile_image} alt={instructor.name} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#2E6DB4]/20 flex items-center justify-center text-xl font-bold text-[#1e3a5f]">
              {instructor.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-[#1e3a5f]">{instructor.name}</h3>
            <p className="text-sm text-slate-500">Tu instructor</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <Label htmlFor="subject">Asunto *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Asunto del mensaje"
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Escribe tu mensaje aquí..."
              className="mt-1.5 rounded-xl h-48"
              required
            />
          </div>

          <div>
            <Label>Archivo adjunto (opcional)</Label>
            <div className="mt-1.5">
              <label htmlFor="message-file-upload">
                <Button type="button" variant="outline" className="w-full" disabled={uploadingFile} asChild>
                  <span className="cursor-pointer">
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subiendo archivo...
                      </>
                    ) : formData.fileUrl ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Archivo adjuntado
                      </>
                    ) : (
                      <>
                        <Paperclip className="w-4 h-4 mr-2" />
                        Adjuntar archivo
                      </>
                    )}
                  </span>
                </Button>
                <input
                  id="message-file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#2E6DB4] hover:bg-[#2E6DB4] rounded-full py-6"
            disabled={sending}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando mensaje...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar mensaje
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}