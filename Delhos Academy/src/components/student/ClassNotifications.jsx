import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';

export default function ClassNotifications({ studentData }) {
  const [notification, setNotification] = useState(null);
  const [checkedLessons, setCheckedLessons] = useState(new Set());
  const [messageNotification, setMessageNotification] = useState(null);

  useEffect(() => {
    if (!studentData?.email) return;

    const checkMessages = async () => {
      try {
        const messages = await api.entities.Message.filter({
          recipient_email: studentData.email,
          is_read: false
        }, '-created_date', 1);

        if (messages.length > 0) {
          setMessageNotification(messages[0]);
        }
      } catch (error) {
        console.error('Error checking messages:', error);
      }
    };

    checkMessages();
    const messageInterval = setInterval(checkMessages, 30000);

    return () => clearInterval(messageInterval);
  }, [studentData]);

  useEffect(() => {
    if (!studentData?.course_id) return;

    const checkUpcomingClasses = async () => {
      try {
        const lessons = await api.entities.CourseLesson.filter({ 
          course_id: studentData.course_id, 
          type: 'live',
          is_completed: false
        });

        const now = new Date();
        
        for (const lesson of lessons) {
          if (!lesson.scheduled_date || !lesson.meet_link) continue;
          if (checkedLessons.has(lesson.id)) continue;

          const lessonTime = new Date(lesson.scheduled_date);
          const timeDiff = lessonTime - now;
          const minutesUntil = Math.floor(timeDiff / 60000);

          // Notificar si falta 10 minutos o menos y aún no ha pasado
          if (minutesUntil <= 10 && minutesUntil > -5) {
            setNotification({
              id: lesson.id,
              title: lesson.title,
              time: lessonTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              meetLink: lesson.meet_link,
              minutesUntil
            });
            setCheckedLessons(prev => new Set(prev).add(lesson.id));
            break;
          }
        }
      } catch (error) {
        console.error('Error checking classes:', error);
      }
    };

    checkUpcomingClasses();
    const interval = setInterval(checkUpcomingClasses, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [studentData, checkedLessons]);

  const handleMarkAsRead = async () => {
    if (messageNotification) {
      try {
        await api.entities.Message.update(messageNotification.id, { is_read: true });
        setMessageNotification(null);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  return (
    <>
      {messageNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2E6DB4] p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Nuevo mensaje</p>
                  <p className="text-white/70 text-sm">{messageNotification.sender_name}</p>
                </div>
              </div>
              <button 
                onClick={handleMarkAsRead}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-[#1E4E86] mb-2">{messageNotification.subject || 'Sin asunto'}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">{messageNotification.message}</p>
          </div>
        </motion.div>
      )}

      {notification && (
        <AnimatePresence>
          <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-20 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2E6DB4] p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Clase próxima</p>
                <p className="text-white/70 text-sm">
                  {notification.minutesUntil > 0 
                    ? `En ${notification.minutesUntil} minuto${notification.minutesUntil !== 1 ? 's' : ''}` 
                    : '¡Ahora!'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-[#1e3a5f] mb-2">{notification.title}</h3>
          <p className="text-sm text-slate-500 mb-4">Hora: {notification.time}</p>
          
          <a href={notification.meetLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-[#1e3a5f] hover:bg-[#2A4C77] rounded-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Unirse a la clase
            </Button>
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
      )}
    </>
  );
}