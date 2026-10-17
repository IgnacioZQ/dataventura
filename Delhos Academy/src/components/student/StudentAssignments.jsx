import React, { useState, useEffect } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Upload, Loader2, Check, Clock, AlertCircle, PartyPopper, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentAssignments({ studentData }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(null); // assignment id recién entregado

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentsData, submissionsData] = await Promise.all([
        api.entities.Assignment.filter({ course_id: studentData.course_id, status: 'active' }),
        api.entities.Submission.filter({ student_id: studentData.id })
      ]);
      
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error loading assignments:', error);
      toast.error('Error al cargar tareas');
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Selecciona un archivo');
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      
      const existingSubmission = getSubmissionForAssignment(selectedAssignment.id);

      const assignmentId = selectedAssignment.id;
      if (existingSubmission) {
        await api.entities.Submission.update(existingSubmission.id, {
          file_url,
          comments,
          status: 'submitted',
          grade: null,
          feedback: null,
          graded_by: null,
          graded_date: null
        });
      } else {
        await api.entities.Submission.create({
          assignment_id: assignmentId,
          student_id: studentData.id,
          student_email: studentData.email,
          student_name: studentData.name,
          file_url,
          comments,
          status: 'submitted'
        });
      }

      setUploadDialogOpen(false);
      setFile(null);
      setComments('');
      setSelectedAssignment(null);
      setJustSubmitted(assignmentId);
      setTimeout(() => setJustSubmitted(null), 4000);
      loadData();
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Error al entregar tarea');
    }
    setUploading(false);
  };

  const getSubmissionForAssignment = (assignmentId) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  const getCountdown = (dueDate) => {
    const diff = new Date(dueDate) - new Date();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return { text: `${days}d ${hours}h restantes`, urgent: days < 2 };
    if (hours > 0) return { text: `${hours}h restantes`, urgent: true };
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${mins} min restantes`, urgent: true };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Mis Tareas</h2>
        <p className="text-slate-500">Entrega tus trabajos y consulta tus calificaciones</p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No hay tareas disponibles</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map(assignment => {
            const submission = getSubmissionForAssignment(assignment.id);
            const overdue = assignment.due_date && isOverdue(assignment.due_date);
            const countdown = assignment.due_date && !submission && !overdue ? getCountdown(assignment.due_date) : null;
            const wasJustSubmitted = justSubmitted === assignment.id;
            
            return (
              <div key={assignment.id} className={`bg-white rounded-xl border p-6 transition-all ${wasJustSubmitted ? 'border-emerald-400 shadow-emerald-100 shadow-lg' : 'border-slate-200'}`}>
                {/* Confirmación visual tras entregar */}
                <AnimatePresence>
                  {wasJustSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3"
                    >
                      <PartyPopper className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-emerald-800">¡Tarea entregada con éxito!</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Tu instructor la revisará pronto.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1e3a5f]">{assignment.title}</h3>
                    {assignment.description && (
                      <p className="text-sm text-slate-600 mt-2">{assignment.description}</p>
                    )}
                    {assignment.due_date && (
                      <div className={`flex items-center gap-2 mt-2 text-sm ${overdue && !submission ? 'text-red-600' : 'text-slate-500'}`}>
                        <Clock className="w-4 h-4" />
                        {overdue && !submission ? 'Vencida: ' : 'Vence: '}
                        {new Date(assignment.due_date).toLocaleString('es-ES')}
                      </div>
                    )}
                    {/* Countdown */}
                    {countdown && (
                      <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${
                        countdown.urgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <Timer className="w-3 h-3" />
                        {countdown.text}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">Puntaje máximo: {assignment.max_grade} pts</p>
                  </div>

                  {!submission ? (
                    <Button
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setUploadDialogOpen(true);
                      }}
                      className="bg-[#2E6DB4] hover:bg-[#1e3a5f]"
                      disabled={overdue}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Entregar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setUploadDialogOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-[#2E6DB4] text-[#2E6DB4]"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Volver a entregar
                    </Button>
                  )}
                </div>

                {submission && (
                  <div className="border-t border-slate-100 pt-4">
                    {submission.status === 'graded' ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <p className="font-semibold text-green-900">Calificada</p>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          {submission.grade}/{assignment.max_grade} pts
                        </p>
                        {submission.feedback && (
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <p className="text-xs font-semibold text-green-900 mb-1">Retroalimentación:</p>
                            <p className="text-sm text-green-800">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600" />
                          <p className="font-semibold text-blue-900">Entregada - Pendiente de calificación</p>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          Entregado el {new Date(submission.created_date).toLocaleString('es-ES')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Entregar Tarea</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Tarea</p>
                <p className="font-semibold text-slate-900">{selectedAssignment.title}</p>
              </div>

              <div>
                <Label>Archivo a entregar</Label>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">Sube tu documento, PDF o imagen</p>
              </div>

              <div>
                <Label>Comentarios (Opcional)</Label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Agrega algún comentario sobre tu entrega..."
                  className="h-20"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={uploading || !file}
                className="w-full bg-[#2E6DB4] hover:bg-[#1e3a5f]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Entregar Tarea
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Input({ type = 'text', ...props }) {
  if (type === 'file') {
    return <input type="file" {...props} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2E6DB4]/10 file:text-[#2E6DB4] hover:file:bg-[#2E6DB4]/20" />;
  }
  return <input type={type} {...props} />;
}