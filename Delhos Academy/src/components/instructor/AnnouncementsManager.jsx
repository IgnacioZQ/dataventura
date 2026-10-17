import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Plus, Loader2, Trash2, Link as LinkIcon, Pencil } from 'lucide-react';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function AnnouncementsManager({ instructorData, courseId = null }) {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [filterCourse, setFilterCourse] = useState(courseId || 'all');
  
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    content: '',
    link_url: '',
    link_text: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (courseId) {
      setFilterCourse(courseId);
      setFormData(prev => ({ ...prev, course_id: courseId }));
    }
  }, [courseId]);

  const loadData = async () => {
    try {
      const [announcementsData, coursesData] = await Promise.all([
        api.entities.Announcement.filter({ instructor_email: instructorData.email }, '-created_date'),
        api.entities.Course.filter({ instructor_email: instructorData.email })
      ]);
      
      // Filter only active courses
      const activeCourses = coursesData.filter(c => c.status === 'active' || c.status === 'open_for_registration');
      const activeCourseIds = activeCourses.map(c => c.id);
      
      // Filter announcements to show only from active courses
      const activeAnnouncements = announcementsData.filter(a => activeCourseIds.includes(a.course_id));
      
      setAnnouncements(activeAnnouncements);
      setCourses(activeCourses);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await api.entities.Announcement.update(editingAnnouncement.id, formData);
        toast.success('Anuncio actualizado');
      } else {
        await api.entities.Announcement.create({
          ...formData,
          instructor_email: instructorData.email,
          instructor_name: instructorData.name
        });
        toast.success('Anuncio publicado');
      }
      setDialogOpen(false);
      setEditingAnnouncement(null);
      setFormData({ course_id: '', title: '', content: '', link_url: '', link_text: '' });
      loadData();
    } catch (error) {
      toast.error(editingAnnouncement ? 'Error al actualizar' : 'Error al publicar anuncio');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      course_id: announcement.course_id,
      title: announcement.title,
      content: announcement.content,
      link_url: announcement.link_url || '',
      link_text: announcement.link_text || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este anuncio?')) return;
    try {
      await api.entities.Announcement.delete(id);
      toast.success('Anuncio eliminado');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  const filteredAnnouncements = filterCourse === 'all' 
    ? announcements 
    : announcements.filter(a => a.course_id === filterCourse);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">Anuncios</h2>
          <p className="text-slate-500">Publica anuncios importantes para tus estudiantes</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingAnnouncement(null);
            setFormData({ course_id: '', title: '', content: '', link_url: '', link_text: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#2E6DB4] hover:bg-[#1e3a5f]">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Anuncio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Editar Anuncio' : 'Nuevo Anuncio'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Curso</Label>
                <Select value={formData.course_id} onValueChange={(val) => setFormData({...formData, course_id: val})}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Título del anuncio"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label>Contenido</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Escribe el anuncio..."
                  className="mt-1.5 h-32"
                  required
                />
              </div>

              <div>
                <Label>Link adjunto (opcional)</Label>
                <Input
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  placeholder="https://..."
                  className="mt-1.5"
                />
              </div>

              {formData.link_url && (
                <div>
                  <Label>Texto del link</Label>
                  <Input
                    value={formData.link_text}
                    onChange={(e) => setFormData({...formData, link_text: e.target.value})}
                    placeholder="Ej: Ver documento"
                    className="mt-1.5"
                  />
                </div>
              )}

              <Button type="submit" className="w-full bg-[#2E6DB4] hover:bg-[#1e3a5f]">
                {editingAnnouncement ? 'Actualizar Anuncio' : 'Publicar Anuncio'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro por curso */}
      {!courseId && (
        <div className="mb-4">
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No hay anuncios {filterCourse !== 'all' ? 'para este curso' : 'publicados'}</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredAnnouncements.map((announcement) => {
            const course = courses.find(c => c.id === announcement.course_id);
            return (
              <div key={announcement.id} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Megaphone className="w-4 h-4 text-[#2E6DB4]" />
                      <span className="text-xs text-slate-500">{course?.title}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1e3a5f]">{announcement.title}</h3>
                    <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{announcement.content}</p>
                    {announcement.link_url && (
                      <a 
                        href={announcement.link_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 mt-3 text-[#2E6DB4] hover:underline"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {announcement.link_text || 'Ver enlace'}
                      </a>
                    )}
                    <p className="text-xs text-slate-400 mt-3">
                      {new Date(announcement.created_date).toLocaleString('es-ES', {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(announcement)}
                      className="text-[#2E6DB4] hover:text-[#1e3a5f]"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}