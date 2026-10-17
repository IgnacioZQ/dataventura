import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Loader2, CheckCircle, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/api/client';
import { toast } from 'sonner';
import { LOGO_ACADEMY } from '@/config/sitio';

export default function MessageStudents() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const [formData, setFormData] = useState({
    recipient: 'all',
    courseFilter: 'all',
    subject: '',
    message: '',
    fileUrl: ''
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const session = localStorage.getItem('instructorSession');
      if (!session) return;
      
      const instructorData = JSON.parse(session);
      const instructorEmail = instructorData.email;

      const [allStudents, allCourses] = await Promise.all([
        api.entities.Student.list(),
        api.entities.Course.list()
      ]);
      
      // Filtrar solo estudiantes y cursos del instructor actual
      const instructorStudents = allStudents.filter(s => s.instructor_email === instructorEmail);
      const instructorCourses = allCourses.filter(c => c.instructor_email === instructorEmail);
      
      setStudents(instructorStudents);
      setCourses(instructorCourses);
    } catch (error) {
      console.error('Error loading data:', error);
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
      let recipients = [];
      
      if (formData.recipient === 'all') {
        if (formData.courseFilter === 'all') {
          recipients = students.map(s => s.email);
        } else {
          recipients = students.filter(s => s.course_id === formData.courseFilter).map(s => s.email);
        }
      } else {
        recipients = [formData.recipient];
      }

      // Enviar correos individuales con formato HTML
      for (const email of recipients) {
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
      <h1>${formData.subject}</h1>
      <div class="message-box">
        ${formData.message.replace(/\n/g, '<br>')}
      </div>
      ${formData.fileUrl ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f0f0; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold; color: #1E3A5F; margin-bottom: 10px;">📎 Archivo adjunto:</p>
          <a href="${formData.fileUrl}" style="color: #2E6DB4; text-decoration: none; word-break: break-all;">${formData.fileUrl}</a>
        </div>
      ` : ''}
      <p style="color: #666; margin-top: 25px;">Enviado por: <strong>Delhos Academy</strong></p>
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
          to: email,
          subject: formData.subject,
          body: emailBody
        });
      }

      toast.success('Mensajes enviados correctamente', {
        description: `Se enviaron ${recipients.length} correo(s).`
      });

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFormData({
          recipient: 'all',
          courseFilter: 'all',
          subject: '',
          message: '',
          fileUrl: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error('Error al enviar mensajes', {
        description: 'Intenta nuevamente.'
      });
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
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">¡Mensajes enviados!</h2>
          <p className="text-slate-500">Los estudiantes recibirán tu mensaje por correo electrónico.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Mensajería</h1>
      <p className="text-slate-500 mb-6">Envía mensajes directos a tus estudiantes por correo</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <form onSubmit={handleSend} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Destinatario</Label>
              <Select 
                value={formData.recipient} 
                onValueChange={(value) => setFormData({...formData, recipient: value})}
              >
                <SelectTrigger className="mt-1.5 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estudiantes</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.email}>
                      {student.name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.recipient === 'all' && (
              <div>
                <Label>Filtrar por curso</Label>
                <Select 
                  value={formData.courseFilter} 
                  onValueChange={(value) => setFormData({...formData, courseFilter: value})}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los cursos</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

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
              <label htmlFor="instructor-message-file">
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
                  id="instructor-message-file"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Envío por correo electrónico</p>
                <p className="text-blue-600">
                  Los mensajes se enviarán directamente al correo de los estudiantes seleccionados.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1e3a5f] hover:bg-[#2A4C77] rounded-full py-6"
            disabled={sending}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando mensajes...
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