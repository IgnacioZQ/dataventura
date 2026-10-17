import React, { useState, useEffect } from 'react';
import { Megaphone, Loader2, Link as LinkIcon } from 'lucide-react';
import { api } from '@/api/client';

export default function StudentAnnouncements({ studentData }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await api.entities.Announcement.filter(
        { course_id: studentData.course_id }, 
        '-created_date'
      );
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
    setLoading(false);
  };

  const markAsRead = async (announcementId, currentReadBy) => {
    if (!currentReadBy.includes(studentData.id)) {
      try {
        await api.entities.Announcement.update(announcementId, {
          read_by: [...currentReadBy, studentData.id]
        });
        loadAnnouncements();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Anuncios</h2>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No hay anuncios publicados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const isUnread = !announcement.read_by?.includes(studentData.id);
            return (
              <div 
                key={announcement.id} 
                className={`bg-white rounded-xl border-l-4 border border-slate-200 p-6 ${
                  isUnread ? 'border-l-[#2E6DB4]' : 'border-l-slate-300'
                }`}
                onClick={() => markAsRead(announcement.id, announcement.read_by || [])}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUnread ? 'bg-[#2E6DB4]/10' : 'bg-slate-100'
                  }`}>
                    <Megaphone className={`w-5 h-5 ${isUnread ? 'text-[#2E6DB4]' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#1e3a5f]">{announcement.title}</h3>
                      {isUnread && (
                        <span className="bg-[#2E6DB4] text-white text-xs px-2 py-0.5 rounded-full">Nuevo</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Por {announcement.instructor_name} • {new Date(announcement.created_date).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-600 whitespace-pre-wrap ml-13">{announcement.content}</p>
                
                {announcement.link_url && (
                  <a 
                    href={announcement.link_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-4 ml-13 text-[#2E6DB4] hover:underline"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {announcement.link_text || 'Ver enlace'}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}