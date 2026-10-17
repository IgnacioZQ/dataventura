import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Paperclip, Mail, User, ArrowLeft, MessageCircle, Trash2, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function InstructorMessaging() {
  const [instructorData, setInstructorData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({ message: '', fileUrl: '' });
  const [unreadCounts, setUnreadCounts] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [sortBy, setSortBy] = useState('unread'); // 'unread', 'recent', 'name'

  useEffect(() => {
    const session = localStorage.getItem('instructorSession');
    if (session) {
      const data = JSON.parse(session);
      setInstructorData(data);
      loadStudents(data.email);
    }
  }, []);

  useEffect(() => {
    if (selectedStudent && instructorData) {
      loadMessages();
    }
  }, [selectedStudent, instructorData]);

  const loadStudents = async (email) => {
    try {
      const [studentsData, coursesData] = await Promise.all([
        api.entities.Student.filter({ instructor_email: email }),
        api.entities.Course.filter({ instructor_email: email })
      ]);
      
      // Solo mostrar estudiantes de cursos activos
      const activeCourseIds = new Set(
        coursesData.filter(c => c.status === 'active').map(c => c.id)
      );
      const activeStudents = studentsData.filter(s => activeCourseIds.has(s.course_id));
      
      // Cargar mensajes para obtener última actividad
      const allMessages = await api.entities.Message.list();
      const studentsWithActivity = activeStudents.map(student => {
        const studentMessages = allMessages.filter(m => 
          m.sender_email === student.email || m.recipient_email === student.email
        );
        const lastMessage = studentMessages.sort((a, b) => 
          new Date(b.created_date) - new Date(a.created_date)
        )[0];
        return {
          ...student,
          lastMessageDate: lastMessage ? lastMessage.created_date : null
        };
      });
      
      setStudents(studentsWithActivity);
      setLoading(false);
      
      // Cargar conteo de mensajes no leídos en segundo plano (sin bloquear)
      loadUnreadCounts(studentsWithActivity, email);
    } catch (error) {
      console.error('Error loading students:', error);
      setLoading(false);
    }
  };

  const loadUnreadCounts = async (studentsData, email) => {
    try {
      // Cargar todos los mensajes no leídos de una sola vez
      const allUnreadMessages = await api.entities.Message.filter({
        recipient_email: email,
        is_read: false
      });
      
      // Contar por estudiante
      const counts = {};
      studentsData.forEach(student => {
        counts[student.id] = allUnreadMessages.filter(m => m.sender_email === student.email).length;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error loading unread counts:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const [sent, received] = await Promise.all([
        api.entities.Message.filter({ 
          sender_email: instructorData.email, 
          recipient_email: selectedStudent.email 
        }),
        api.entities.Message.filter({ 
          sender_email: selectedStudent.email, 
          recipient_email: instructorData.email 
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
      
      // Actualizar contador
      setUnreadCounts(prev => ({...prev, [selectedStudent.id]: 0}));
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
      if (editingMessage) {
        await api.entities.Message.update(editingMessage.id, {
          message: formData.message,
          file_url: formData.fileUrl || null
        });
        toast.success('Mensaje actualizado');
        setEditingMessage(null);
      } else {
        await api.entities.Message.create({
          sender_email: instructorData.email,
          sender_name: instructorData.name,
          sender_type: 'instructor',
          recipient_email: selectedStudent.email,
          recipient_name: selectedStudent.name,
          subject: '',
          message: formData.message,
          file_url: formData.fileUrl || null
        });
        toast.success('Mensaje enviado');
      }
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

  const getSortedStudents = () => {
    const studentsCopy = [...students];
    if (sortBy === 'unread') {
      return studentsCopy.sort((a, b) => (unreadCounts[b.id] || 0) - (unreadCounts[a.id] || 0));
    } else if (sortBy === 'recent') {
      return studentsCopy.sort((a, b) => {
        const dateA = a.lastMessageDate ? new Date(a.lastMessageDate) : new Date(0);
        const dateB = b.lastMessageDate ? new Date(b.lastMessageDate) : new Date(0);
        return dateB - dateA;
      });
    } else {
      return studentsCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  if (!selectedStudent) {
    const sortedStudents = getSortedStudents();
    
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Mensajería</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-700">Selecciona un estudiante</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unread">No leídos primero</SelectItem>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="name">Orden alfabético</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
            {sortedStudents.map(student => (
              <div key={student.id} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="flex-1 flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left relative"
                >
                  <div className="w-10 h-10 rounded-full bg-[#2E6DB4]/20 flex items-center justify-center text-[#1e3a5f] font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">{student.name}</p>
                    <p className="text-sm text-slate-400">{student.email}</p>
                  </div>
                  {unreadCounts[student.id] > 0 && (
                    <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {unreadCounts[student.id]}
                    </div>
                  )}
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={async () => {
                    if (confirm(`¿Eliminar conversación con ${student.name}?`)) {
                      try {
                        const allMessages = await api.entities.Message.list();
                        const chatMessages = allMessages.filter(m => 
                          (m.sender_email === instructorData.email && m.recipient_email === student.email) ||
                          (m.sender_email === student.email && m.recipient_email === instructorData.email)
                        );
                        await Promise.all(chatMessages.map(m => api.entities.Message.delete(m.id)));
                        loadStudents(instructorData.email);
                      } catch (error) {
                        console.error('Error deleting chat:', error);
                      }
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#2E6DB4]/20 flex items-center justify-center text-[#1e3a5f] font-medium text-xl">
            {selectedStudent.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">{selectedStudent.name}</h1>
            <p className="text-slate-500">{selectedStudent.email}</p>
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
                  className={`flex ${msg.sender_type === 'instructor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-lg">
                    <div className={`flex-1 p-4 rounded-xl ${
                      msg.sender_type === 'instructor' 
                        ? 'bg-[#1e3a5f] text-white' 
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
                    {msg.sender_type === 'instructor' && (
                      <Button
                        size="icon" aria-label="Editar"
                        variant="ghost"
                        className="text-slate-400 hover:text-[#1e3a5f] h-8 w-8"
                        onClick={() => {
                          setEditingMessage(msg);
                          setFormData({ message: msg.message, fileUrl: msg.file_url || '' });
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Send Message */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {editingMessage && (
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
              <p className="text-sm text-slate-600">Editando mensaje</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingMessage(null);
                  setFormData({ message: '', fileUrl: '' });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
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
                className="bg-[#1e3a5f] hover:bg-[#2A4C77] rounded-full"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingMessage ? (
                  <Pencil className="w-4 h-4" />
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