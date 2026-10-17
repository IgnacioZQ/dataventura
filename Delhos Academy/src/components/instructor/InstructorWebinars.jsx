import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Trash2, Edit, X, CheckCircle, Upload, Radio, Wrench, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { api } from '@/api/client';
import { toast } from 'sonner';

const TYPE_LABELS = { webinar: 'Webinar', workshop: 'Workshop' };
const TYPE_COLORS = { webinar: 'bg-[#EAF2FB] text-[#1E4E86]', workshop: 'bg-orange-100 text-orange-700' };
const STATUS_LABELS = { upcoming: 'Próximo', live: 'En vivo', finished: 'Finalizado' };
const STATUS_COLORS = { upcoming: 'bg-blue-500', live: 'bg-red-500', finished: 'bg-slate-400' };

export default function InstructorWebinars() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const session = JSON.parse(localStorage.getItem('instructorSession'));
      const all = await api.entities.Webinar.filter({ instructor_email: session.email }, '-created_date');
      setEvents(all);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    const session = JSON.parse(localStorage.getItem('instructorSession'));
    setEditing({
      title: '',
      description: '',
      type: 'webinar',
      date: '',
      time: '',
      duration: '',
      meet_link: '',
      price: 0,
      image_url: '',
      available_spots: '',
      topics: [''],
      requirements: [''],
      status: 'upcoming',
      category: '',
      registration_link: '',
      instructor_email: session.email,
      instructor_name: session.name
    });
    setShowDialog(true);
  };

  const handleEdit = (event) => {
    setEditing({
      ...event,
      topics: event.topics?.length ? event.topics : [''],
      requirements: event.requirements?.length ? event.requirements : [''],
      available_spots: event.available_spots || ''
    });
    setShowDialog(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      setEditing({ ...editing, image_url: file_url });
      toast.success('Imagen subida');
    } catch (error) {
      toast.error('Error al subir imagen');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!editing.title.trim()) return;
    setSaving(true);
    try {
      const data = {
        ...editing,
        topics: editing.topics.filter(t => t.trim()),
        requirements: editing.requirements.filter(r => r.trim()),
        available_spots: editing.available_spots ? parseInt(editing.available_spots) : null
      };
      if (editing.id) {
        await api.entities.Webinar.update(editing.id, data);
        toast.success('Evento actualizado');
      } else {
        await api.entities.Webinar.create(data);
        toast.success('Evento creado');
      }
      setShowDialog(false);
      setEditing(null);
      loadEvents();
    } catch (error) {
      toast.error('Error al guardar');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await api.entities.Webinar.delete(toDelete.id);
      toast.success('Evento eliminado');
      setToDelete(null);
      loadEvents();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const updateList = (field, index, value) => {
    const arr = [...editing[field]];
    arr[index] = value;
    setEditing({ ...editing, [field]: arr });
  };

  const addItem = (field) => setEditing({ ...editing, [field]: [...editing[field], ''] });
  const removeItem = (field, index) => setEditing({ ...editing, [field]: editing[field].filter((_, i) => i !== index) });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Webinars & Workshops</h1>
          <p className="text-slate-500 text-sm">Gestiona tus eventos en vivo</p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#2E6DB4] to-[#1E3A5F] hover:from-[#1E3A5F] hover:to-[#2E6DB4] rounded-full shadow-lg"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-20 h-20 bg-[#2E6DB4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Radio className="w-10 h-10 text-[#2E6DB4]" />
          </div>
          <p className="text-slate-500 mb-4">No tienes eventos creados</p>
          <Button onClick={handleCreate} className="bg-[#2E6DB4] hover:bg-[#1E3A5F] rounded-full">
            Crear tu primer evento
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => {
            const Icon = event.type === 'workshop' ? Wrench : Radio;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all group"
              >
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${STATUS_COLORS[event.status]}`}>
                      {STATUS_LABELS[event.status]}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[event.type]}`}>
                      {TYPE_LABELS[event.type]}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-[#1E3A5F] mb-1">{event.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{event.description}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-4">
                    {event.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </span>
                    )}
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                    )}
                    <span className="font-semibold text-[#2E6DB4]">
                      {event.price === 0 || !event.price ? 'Gratuito' : `$${Math.round(event.price).toLocaleString('es-CL')}`}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full" onClick={() => handleEdit(event)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full border-red-200 text-red-600 hover:bg-red-50" onClick={() => setToDelete(event)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1E3A5F]">
              {editing?.id ? 'Editar Evento' : 'Nuevo Webinar / Workshop'}
            </DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-5 mt-4">
              {/* Imagen */}
              <div>
                <Label className="text-base font-semibold">Imagen del evento</Label>
                <div className="mt-2">
                  {editing.image_url ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <img src={editing.image_url} alt="Event" className="w-full h-40 object-cover" />
                      <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setEditing({ ...editing, image_url: '' })}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#2E6DB4] transition-colors">
                      <Upload className="w-7 h-7 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">Subir imagen</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  )}
                  {uploading && <p className="text-sm text-[#2E6DB4] mt-1">Subiendo...</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tipo */}
                <div>
                  <Label>Tipo *</Label>
                  <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Estado */}
                <div>
                  <Label>Estado</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Próximo</SelectItem>
                      <SelectItem value="live">En vivo</SelectItem>
                      <SelectItem value="finished">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Título */}
                <div className="col-span-2">
                  <Label>Título *</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Ej: Introducción a Machine Learning" className="mt-1.5" />
                </div>

                {/* Descripción */}
                <div className="col-span-2">
                  <Label>Descripción</Label>
                  <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Describe el contenido del evento..." className="mt-1.5 h-24" />
                </div>

                {/* Fecha */}
                <div>
                  <Label>Fecha</Label>
                  <Input value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} placeholder="Ej: 15 de Abril 2026" className="mt-1.5" />
                </div>

                {/* Hora */}
                <div>
                  <Label>Hora</Label>
                  <Input value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} placeholder="Ej: 19:00 - 21:00" className="mt-1.5" />
                </div>

                {/* Duración */}
                <div>
                  <Label>Duración</Label>
                  <Input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="Ej: 2 horas" className="mt-1.5" />
                </div>

                {/* Cupos */}
                <div>
                  <Label>Cupos disponibles</Label>
                  <Input type="number" value={editing.available_spots} onChange={(e) => setEditing({ ...editing, available_spots: e.target.value })} placeholder="Dejar vacío = ilimitado" className="mt-1.5" />
                </div>

                {/* Precio */}
                <div>
                  <Label>Precio ($)</Label>
                  <Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} placeholder="0 = Gratuito" className="mt-1.5" />
                </div>

                {/* Categoría */}
                <div>
                  <Label>Categoría</Label>
                  <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Ej: Machine Learning" className="mt-1.5" />
                </div>

                {/* Meet link */}
                <div className="col-span-2">
                  <Label>Enlace de acceso (Zoom / Meet)</Label>
                  <Input value={editing.meet_link} onChange={(e) => setEditing({ ...editing, meet_link: e.target.value })} placeholder="https://meet.google.com/..." className="mt-1.5" />
                </div>
              </div>

              {/* Temas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Temas a tratar</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => addItem('topics')}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {editing.topics.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={t} onChange={(e) => updateList('topics', i, e.target.value)} placeholder="Ej: Fundamentos de redes neuronales" />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeItem('topics', i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requisitos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Requisitos previos</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => addItem('requirements')}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {editing.requirements.map((r, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={r} onChange={(e) => updateList('requirements', i, e.target.value)} placeholder="Ej: Conocimientos básicos de Python" />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeItem('requirements', i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">Cancelar</Button>
                <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-[#2E6DB4] to-[#1E3A5F]" disabled={saving || !editing.title.trim()}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  {editing.id ? 'Guardar cambios' : 'Crear evento'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminación */}
      <AlertDialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará "{toDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}