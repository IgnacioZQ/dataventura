import React, { useState, useEffect } from 'react';
import { Home, Calendar, Settings, BookOpen, Mail, FileText, MessageSquare, Megaphone } from 'lucide-react';
import { NavPanel } from '@/components/rediseno/Panel';
import { pageHref } from '@/utils';
import { api } from '@/api/client';

const menuItems = [
  { icon: Home, label: 'Inicio', view: 'home' },
  { icon: BookOpen, label: 'Curso', view: 'course' },
  { icon: FileText, label: 'Tareas', view: 'assignments' },
  { icon: Calendar, label: 'Horario', view: 'schedule' },
  { icon: MessageSquare, label: 'Foro', view: 'forum' },
  { icon: Megaphone, label: 'Anuncios', view: 'announcements' },
  { icon: Mail, label: 'Mensajería', view: 'messages' },
  { icon: Settings, label: 'Configuración', view: 'settings' }
];

export default function StudentSidebar({ currentView, setCurrentView, setSelectedCourse, onUnreadCountsChange }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [unreadForum, setUnreadForum] = useState(0);
  const [lastChecked, setLastChecked] = useState({
    announcements: localStorage.getItem('lastCheckedAnnouncements') || new Date().toISOString(),
    forum: localStorage.getItem('lastCheckedForum') || new Date().toISOString()
  });

  useEffect(() => {
    loadUnreadMessages();
    loadUnreadAnnouncements();
    loadUnreadForum();
    const interval = setInterval(() => {
      loadUnreadMessages();
      loadUnreadAnnouncements();
      loadUnreadForum();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (onUnreadCountsChange) {
      onUnreadCountsChange({
        messages: unreadCount,
        announcements: unreadAnnouncements,
        forum: unreadForum,
      });
    }
  }, [unreadCount, unreadAnnouncements, unreadForum]);

  const loadUnreadMessages = async () => {
    try {
      const session = localStorage.getItem('studentSession');
      if (!session) return;
      const student = JSON.parse(session);
      const messages = await api.entities.Message.filter({ 
        recipient_email: student.email,
        is_read: false
      });
      setUnreadCount(messages.length);
    } catch (error) {
      console.error('Error loading unread messages:', error);
    }
  };

  const loadUnreadAnnouncements = async () => {
    try {
      const session = localStorage.getItem('studentSession');
      if (!session) return;
      const student = JSON.parse(session);
      const announcements = await api.entities.Announcement.filter({ 
        course_id: student.course_id
      });
      const unreadAnnouncements = announcements.filter(a => 
        !a.read_by?.includes(student.id)
      );
      setUnreadAnnouncements(unreadAnnouncements.length);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const loadUnreadForum = async () => {
    try {
      const session = localStorage.getItem('studentSession');
      if (!session) return;
      const student = JSON.parse(session);
      const posts = await api.entities.ForumPost.filter({ 
        course_id: student.course_id
      });
      const newPosts = posts.filter(p => 
        new Date(p.created_date) > new Date(localStorage.getItem('lastCheckedForum') || lastChecked.forum) && 
        p.author_email !== student.email
      );
      setUnreadForum(newPosts.length);
    } catch (error) {
      console.error('Error loading forum posts:', error);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (setSelectedCourse) setSelectedCourse(null);
    
    if (view === 'announcements') {
      const now = new Date().toISOString();
      localStorage.setItem('lastCheckedAnnouncements', now);
      setLastChecked(prev => ({ ...prev, announcements: now }));
      setUnreadAnnouncements(0);
    } else if (view === 'forum') {
      const now = new Date().toISOString();
      localStorage.setItem('lastCheckedForum', now);
      setLastChecked(prev => ({ ...prev, forum: now }));
      setUnreadForum(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentSession');
    window.location.href = pageHref('Acceso');
  };

  const insignias = { messages: unreadCount, announcements: unreadAnnouncements, forum: unreadForum };
  return (
    <NavPanel
      items={menuItems.map(m => ({ id: m.view, texto: m.label, icono: m.icon, insignia: insignias[m.view] || 0 }))}
      actual={currentView}
      onCambiar={handleViewChange}
      onSalir={handleLogout}
      pie={<><span className="font-semibold">¿Necesitas ayuda?</span><span className="leading-normal text-texto">Escríbele a tu instructor desde Mensajería.</span></>}
    />
  );
}
