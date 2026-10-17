import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function StudentMessaging({ studentData }) {
  const [instructor, setInstructor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({ message: '', fileUrl: '' });

  useEffect(() => {
    if (studentData?.instructor_email) {
      loadInstructor();
      loadMessages();
    }
  }, [studentData]);

  const loadInstructor = async () => {
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

  const loadMessages = async () => {
    try {
      const [sent, received] = await Promise.all([
        api.entities.Message.filter({ 
          sender_email: studentData.email, 
          recipient_email: studentData.instructor_email 
        }),
        api.entities.Message.filter({ 
          sender_email: studentData.instructor_email, 
          recipient_email: studentData.email 
        })
      ]);
      const allMessages = [...sent, ...received].sort((a, b) => 
        new Date(a.created_date) - new Date(b.created_date)
      );
      setMessages(allMessages);
      
      // Marcar como leídos los mensajes recibidos
      for (const msg of received) {
        if (!msg.is_read) {
          await api.entities.Message.update(msg.id, { is_read: true });
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
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
    if (e) e.preventDefault();
    if (!formData.message.trim()) return;
    
    setSending(true);
    try {
      await api.entities.Message.create({
        sender_email: studentData.email,
        sender_name: studentData.name,
        sender_type: 'student',
        recipient_email: studentData.instructor_email,
        recipient_name: instructor.name,
        subject: '',
        message: formData.message,
        file_url: formData.fileUrl || null
      });
      toast.success('Mensaje enviado');
      setFormData({ message: '', fileUrl: '' });
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    }
    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">No se encontró información del instructor</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#2E6DB4]/20 flex items-center justify-center text-[#1e3a5f] font-medium text-xl">
            {instructor.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">{instructor.name}</h1>
            <p className="text-slate-500">Tu instructor</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Messages */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No hay mensajes aún</p>
          ) : (
            <div className="space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender_type === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md p-4 rounded-xl ${
                    msg.sender_type === 'student' 
                      ? 'bg-[#2E6DB4] text-white' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {msg.subject && (
                      <p className="font-semibold mb-1">{msg.subject}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    {msg.file_url && (
                      <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-xs underline mt-2 block">
                        Ver archivo adjunto
                      </a>
                    )}
                    <p className="text-xs opacity-70 mt-2">
                      {new Date(msg.created_date).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Send Message */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-end gap-3">
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje... (Enter para enviar)"
              className="rounded-xl flex-1 min-h-[50px] max-h-[120px] resize-none"
            />
            <div className="flex gap-2">
              <label>
                <input type="file" onChange={handleFileUpload} className="hidden" />
                <Button type="button" variant="outline" size="icon" aria-label="Adjuntar archivo" disabled={uploadingFile} asChild>
                  <span className="cursor-pointer">
                    <Paperclip className="w-4 h-4" />
                  </span>
                </Button>
              </label>
              <Button 
                onClick={handleSend} 
                disabled={sending || !formData.message.trim()} 
                size="icon" aria-label="Enviar mensaje"
                className="bg-[#2E6DB4] hover:bg-[#2E6DB4] rounded-full"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          {formData.fileUrl && (
            <p className="text-xs text-slate-500 mt-2">Archivo adjunto</p>
          )}
        </div>
      </div>
    </div>
  );
}