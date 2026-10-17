import React, { useState, useEffect } from 'react';
import { api } from '@/api/client';
import { jsPDF } from 'jspdf';
import { Download, Users, BookOpen, Loader2, FileText, Sparkles, GraduationCap, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// ── PDF generation (programmatic, no DOM capture) ──────────────────────────
const MONTHS = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

function getCertDate() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')} DE ${MONTHS[d.getMonth()]} DEL ${d.getFullYear()}`;
}

function centeredSpacedText(pdf, text, cx, y, charSpaceMm) {
  const chars = text.split('');
  const totalW = chars.reduce((sum, ch) => sum + pdf.getTextWidth(ch), 0) + charSpaceMm * (chars.length - 1);
  let curX = cx - totalW / 2;
  chars.forEach((ch, i) => {
    pdf.text(ch, curX, y);
    curX += pdf.getTextWidth(ch) + (i < chars.length - 1 ? charSpaceMm : 0);
  });
}

function generateCertPDF({ studentName, courseName, courseHours }) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210;
  const CX = W / 2;

  pdf.setFillColor(250, 250, 248);
  pdf.rect(0, 0, W, H, 'F');

  // Left accent bar
  pdf.setFillColor(10, 25, 41);
  pdf.rect(0, 0, 2, H, 'F');
  pdf.setFillColor(27, 80, 137);
  pdf.rect(2, H / 3, 2, H / 3, 'F');
  pdf.setFillColor(43, 124, 179);
  pdf.rect(4, (H * 2) / 3, 2, H / 3, 'F');

  // Borders
  pdf.setDrawColor(27, 80, 137);
  pdf.setLineWidth(0.2);
  pdf.setGState(pdf.GState({ opacity: 0.2 }));
  pdf.rect(10, 7, W - 17, H - 14);
  pdf.setLineWidth(0.1);
  pdf.setGState(pdf.GState({ opacity: 0.1 }));
  pdf.rect(12, 9, W - 21, H - 18);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // DELHOS ACADEMY
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(43, 124, 179);
  centeredSpacedText(pdf, 'DELHOS ACADEMY', CX, 28, 2.5);

  // Divider
  pdf.setDrawColor(43, 124, 179);
  pdf.setLineWidth(0.3);
  pdf.setGState(pdf.GState({ opacity: 0.4 }));
  pdf.line(CX - 8, 32, CX + 8, 32);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // CERTIFICADO
  pdf.setFont('times', 'bold');
  pdf.setFontSize(36);
  pdf.setTextColor(10, 25, 41);
  centeredSpacedText(pdf, 'CERTIFICADO', CX, 48, 3.5);

  // DE PARTICIPACIÓN
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(27, 80, 137);
  centeredSpacedText(pdf, 'DE PARTICIPACIÓN', CX, 57, 2.5);

  // OTORGADO A
  pdf.setFontSize(6);
  pdf.setTextColor(156, 163, 175);
  centeredSpacedText(pdf, 'OTORGADO A', CX, 70, 2);

  // Student name
  pdf.setFont('times', 'italic');
  pdf.setFontSize(28);
  pdf.setTextColor(10, 25, 41);
  pdf.text(studentName, CX, 83, { align: 'center' });

  // Name underline
  const nameW = Math.min(pdf.getTextWidth(studentName) + 20, 140);
  pdf.setDrawColor(27, 80, 137);
  pdf.setLineWidth(0.2);
  pdf.setGState(pdf.GState({ opacity: 0.35 }));
  pdf.line(CX - nameW / 2, 87, CX + nameW / 2, 87);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Body
  pdf.setFont('times', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(75, 85, 99);
  pdf.text('Por haber completado satisfactoriamente el programa', CX, 106, { align: 'center' });

  pdf.setFont('times', 'italic');
  pdf.setTextColor(10, 25, 41);
  const courseLines = pdf.splitTextToSize(`"${courseName}"`, 230);
  courseLines.forEach((line, i) => {
    pdf.text(line, CX, 115 + i * 8, { align: 'center' });
  });
  const afterCourse = 115 + courseLines.length * 8;

  pdf.setFont('times', 'normal');
  pdf.setTextColor(75, 85, 99);
  pdf.text('correspondiente a', CX, afterCourse + 6, { align: 'center' });

  pdf.setFont('times', 'bold');
  pdf.setTextColor(27, 80, 137);
  pdf.text(`${courseHours} horas cronológicas de formación en ciencia de datos aplicada.`, CX, afterCourse + 15, { align: 'center' });

  // Date
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(156, 163, 175);
  centeredSpacedText(pdf, getCertDate(), CX, 192, 2);

  return pdf;
}

// ── Preview component ───────────────────────────────────────────────────────
function CertPreview({ studentName, courseName, courseHours }) {
  const date = getCertDate();
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FAFAF8',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Georgia, serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 80px 40px 60px',
      boxSizing: 'border-box',
    }}>
      {/* Accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '7px', background: 'linear-gradient(180deg,#16202C 0%,#1E4E86 50%,#2E6DB4 100%)' }} />
      {/* Borders */}
      <div style={{ position: 'absolute', top: 16, left: 24, right: 16, bottom: 16, border: '1px solid rgba(27,80,137,0.15)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 20, left: 28, right: 20, bottom: 20, border: '0.5px solid rgba(27,80,137,0.08)', pointerEvents: 'none' }} />
      {/* Content */}
      <div style={{ textAlign: 'center', zIndex: 1, width: '100%' }}>
        <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#2E6DB4', fontFamily: 'Arial, sans-serif', fontWeight: 500, marginBottom: '12px' }}>DELHOS ACADEMY</div>
        <div style={{ width: '30px', height: '1px', background: '#2E6DB4', margin: '0 auto 12px', opacity: 0.5 }} />
        <div style={{ fontSize: '42px', fontWeight: 700, letterSpacing: '6px', color: '#16202C', lineHeight: 1, marginBottom: '6px', fontFamily: 'Georgia, serif' }}>CERTIFICADO</div>
        <div style={{ fontSize: '9px', letterSpacing: '6px', color: '#1E4E86', fontFamily: 'Arial, sans-serif', fontWeight: 300, marginBottom: '24px' }}>DE PARTICIPACIÓN</div>
        <div style={{ fontSize: '8px', letterSpacing: '3px', color: '#9CA3AF', fontFamily: 'Arial, sans-serif', marginBottom: '8px' }}>OTORGADO A</div>
        <div style={{ fontSize: '32px', fontStyle: 'italic', color: '#16202C', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>{studentName || 'Nombre Apellido'}</div>
        <div style={{ width: '200px', height: '1px', background: 'linear-gradient(90deg,transparent,#1E4E86 30%,#1E4E86 70%,transparent)', margin: '0 auto 20px', opacity: 0.4 }} />
        <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto', fontFamily: 'Georgia, serif', fontWeight: 300 }}>
          Por haber completado satisfactoriamente el programa{' '}
          <span style={{ fontStyle: 'italic', color: '#16202C' }}>"{courseName || 'Nombre del Curso'}"</span>
          {', '}correspondiente a{' '}
          <span style={{ fontWeight: 700, color: '#1E4E86' }}>{courseHours || '40'} horas cronológicas</span>
          {' '}de formación en ciencia de datos aplicada.
        </div>
        <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#9CA3AF', fontFamily: 'Arial, sans-serif', marginTop: '18px' }}>{date}</div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CertificateGenerator({ courseId = null }) {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [courseHours, setCourseHours] = useState('40');
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, active: false });

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === courseId);
      if (course) setSelectedCourse(course);
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (selectedCourse) {
      const filtered = students.filter(s => s.course_id === selectedCourse.id);
      setCourseStudents(filtered);
      setSelectedStudent(prev => filtered.find(s => s.id === prev?.id) || filtered[0] || null);
      // Pre-fill hours from first student that has them set
      const withHours = filtered.find(s => s.certificate_hours);
      if (withHours) setCourseHours(String(withHours.certificate_hours));
    } else {
      setCourseStudents([]);
      setSelectedStudent(null);
    }
  }, [selectedCourse, students]);

  const getFullName = (student) => student?.nombre_completo || student?.name || 'Nombre Apellido';

  const loadData = async () => {
    setLoading(true);
    try {
      const session = JSON.parse(localStorage.getItem('instructorSession'));
      if (!session?.email) { setLoading(false); return; }
      const res = await api.functions.invoke('getInstructorDashboard', { instructorEmail: session.email });
      const { allCourses, students: allStudents } = res.data;
      setCourses(allCourses || []);
      setStudents(allStudents || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    }
    setLoading(false);
  };

  const refreshStudents = async () => {
    const session = JSON.parse(localStorage.getItem('instructorSession'));
    const res = await api.functions.invoke('getInstructorDashboard', { instructorEmail: session.email });
    const all = res.data.students || [];
    setStudents(all);
  };

  // Download one PDF using programmatic jsPDF
  const handleDownloadOne = async () => {
    if (!selectedStudent || !selectedCourse) return;
    setIsGenerating(true);
    try {
      const pdf = generateCertPDF({
        studentName: getFullName(selectedStudent),
        courseName: selectedCourse.title,
        courseHours: courseHours || '40',
      });
      const safeName = getFullName(selectedStudent).replace(/\s+/g, '_');
      pdf.save(`Certificado_${safeName}.pdf`);
      toast.success(`Certificado de ${getFullName(selectedStudent)} descargado`);
    } catch (err) {
      console.error(err);
      toast.error('Error al generar el certificado: ' + err.message);
    }
    setIsGenerating(false);
  };

  // Download all PDFs
  const handleGenerateAll = async () => {
    if (!courseStudents.length || !selectedCourse) return;
    setBulkProgress({ current: 0, total: courseStudents.length, active: true });
    try {
      for (let i = 0; i < courseStudents.length; i++) {
        setBulkProgress(p => ({ ...p, current: i + 1 }));
        const pdf = generateCertPDF({
          studentName: getFullName(courseStudents[i]),
          courseName: selectedCourse.title,
          courseHours: courseHours || '40',
        });
        const safeName = getFullName(courseStudents[i]).replace(/\s+/g, '_');
        pdf.save(`Certificado_${safeName}.pdf`);
        await new Promise(r => setTimeout(r, 400));
      }
      toast.success(`¡${courseStudents.length} certificados generados!`);
    } catch (err) {
      console.error(err);
      toast.error('Error durante la generación masiva');
    }
    setBulkProgress({ current: 0, total: 0, active: false });
  };

  // Toggle certificate enabled for one student — uses manageStudent (asServiceRole)
  const handleToggleCertificate = async (student, enabled) => {
    setTogglingId(student.id);
    try {
      const hours = parseInt(courseHours) || 40;
      await api.functions.invoke('manageStudent', {
        action: 'update',
        id: student.id,
        certificate_enabled: enabled,
        certificate_hours: hours,
      });
      await refreshStudents();
      toast.success(enabled ? '¡Certificado habilitado!' : 'Certificado deshabilitado');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar: ' + err.message);
    }
    setTogglingId(null);
  };

  // Toggle all students in course
  const handleToggleAll = async () => {
    const enabledCount = courseStudents.filter(s => s.certificate_enabled).length;
    const enable = enabledCount === 0;
    const targets = enable ? courseStudents : courseStudents.filter(s => s.certificate_enabled);
    const hours = parseInt(courseHours) || 40;
    setTogglingId('all');
    try {
      await Promise.all(targets.map(s =>
        api.functions.invoke('manageStudent', {
          action: 'update',
          id: s.id,
          certificate_enabled: enable,
          certificate_hours: hours,
        })
      ));
      await refreshStudents();
      toast.success(enable
        ? `Certificado habilitado para ${targets.length} estudiantes`
        : `Certificado deshabilitado para ${targets.length} estudiantes`
      );
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar estudiantes');
    }
    setTogglingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  const previewScale = 0.56;
  const previewW = Math.round(1000 * previewScale);
  const previewH = Math.round(707 * previewScale);

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 bg-gradient-to-br from-[#2E6DB4] to-[#1E3A5F] rounded-xl flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Generador de Certificados</h1>
            <p className="text-slate-400 text-sm">Crea y descarga certificados PDF para tus estudiantes</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">

        {/* Left panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">

          {/* Course selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2E6DB4]" />
              Seleccionar Curso
            </h3>
            {courses.length === 0 ? (
              <p className="text-sm text-slate-400">No tienes cursos disponibles.</p>
            ) : courseId ? (
              <p className="text-sm font-medium text-slate-700">{selectedCourse?.title}</p>
            ) : (
              <Select
                value={selectedCourse?.id || ''}
                onValueChange={(id) => setSelectedCourse(courses.find(c => c.id === id))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Elige un curso..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedCourse && (
              <div className="mt-4">
                <Label className="text-xs text-slate-500 font-medium">Horas cronológicas del certificado</Label>
                <Input
                  type="number"
                  value={courseHours}
                  onChange={e => setCourseHours(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  placeholder="Ej: 40"
                  min="1"
                />
                <p className="text-xs text-slate-400 mt-1">Este valor se guarda en el certificado y en el registro del estudiante al habilitar.</p>
              </div>
            )}
          </div>

          {/* Student list */}
          {selectedCourse && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2E6DB4]" />
                Estudiantes
                <span className="ml-auto bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                  {courseStudents.length}
                </span>
              </h3>

              {courseStudents.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No hay estudiantes en este curso</p>
              ) : (
                <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                  {courseStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm ${
                        selectedStudent?.id === student.id
                          ? 'bg-[#1E3A5F] text-white shadow-sm'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        selectedStudent?.id === student.id ? 'bg-white/20 text-white' : 'bg-[#2E6DB4]/10 text-[#1E3A5F]'
                      }`}>
                        {student.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="truncate font-medium flex-1">{getFullName(student)}</span>
                      {student.certificate_enabled && (
                        <span className={selectedStudent?.id === student.id ? 'text-white/70 text-xs' : 'text-green-500 text-xs'}>✓</span>
                      )}
                      {selectedStudent?.id === student.id && (
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-white/80" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Enable certificate for selected student */}
          {selectedCourse && selectedStudent && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#2E6DB4]" />
                Habilitar descarga para estudiante
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Permite que <strong>{getFullName(selectedStudent)}</strong> descargue su certificado con <strong>{courseHours} horas</strong>.
              </p>
              <button
                onClick={() => handleToggleCertificate(selectedStudent, !selectedStudent.certificate_enabled)}
                disabled={togglingId === selectedStudent.id || togglingId === 'all'}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2 disabled:opacity-60 ${
                  selectedStudent.certificate_enabled
                    ? 'bg-green-50 border-green-500 text-green-700 hover:bg-red-50 hover:border-red-400 hover:text-red-600'
                    : 'bg-slate-50 border-dashed border-slate-300 text-slate-600 hover:border-[#2E6DB4] hover:text-[#2E6DB4]'
                }`}
              >
                {togglingId === selectedStudent.id ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                ) : selectedStudent.certificate_enabled ? (
                  <><CheckCircle className="w-4 h-4" /> Habilitado (clic para deshabilitar)</>
                ) : (
                  <><Eye className="w-4 h-4" /> Habilitar certificado</>
                )}
              </button>
              <button
                onClick={handleToggleAll}
                disabled={togglingId !== null}
                className="w-full mt-2 text-xs text-slate-400 hover:text-[#2E6DB4] underline disabled:opacity-50"
              >
                {togglingId === 'all' ? 'Guardando...' : (
                  courseStudents.filter(s => s.certificate_enabled).length > 0
                    ? `Deshabilitar para todos (${courseStudents.filter(s => s.certificate_enabled).length} activos)`
                    : `Habilitar para todos (${courseStudents.length})`
                )}
              </button>
            </div>
          )}

          {/* Download actions */}
          {selectedCourse && courseStudents.length > 0 && (
            <div className="space-y-3">
              <Button
                onClick={handleDownloadOne}
                disabled={!selectedStudent || isGenerating || bulkProgress.active}
                className="w-full bg-gradient-to-r from-[#2E6DB4] to-[#1E3A5F] hover:from-[#1E3A5F] hover:to-[#2E6DB4] rounded-xl py-6 shadow-lg text-base font-semibold"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generando PDF...</>
                ) : (
                  <><Download className="w-4 h-4 mr-2" /> Descargar certificado</>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-slate-50 px-2 text-slate-400">o</span></div>
              </div>

              <Button
                onClick={handleGenerateAll}
                disabled={isGenerating || bulkProgress.active}
                variant="outline"
                className="w-full rounded-xl py-6 border-[#2E6DB4] text-[#2E6DB4] hover:bg-[#2E6DB4]/5 text-base font-semibold"
              >
                {bulkProgress.active ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generando {bulkProgress.current} de {bulkProgress.total}...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generar todos ({courseStudents.length})</>
                )}
              </Button>

              {bulkProgress.active && (
                <div className="space-y-2 px-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2E6DB4] to-[#1E3A5F] rounded-full transition-all duration-500"
                      style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-slate-500">{bulkProgress.current} de {bulkProgress.total} certificados</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Right: Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-500 font-medium">Vista previa del certificado</p>
          </div>

          <div
            className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
            style={{ width: `${previewW}px`, height: `${previewH}px`, flexShrink: 0 }}
          >
            <div style={{ width: '1000px', height: '707px', transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
              <CertPreview
                studentName={getFullName(selectedStudent)}
                courseName={selectedCourse?.title || 'Nombre del Curso'}
                courseHours={courseHours || '40'}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-1">
            <p className="text-xs text-slate-400">PDF generado programáticamente · A4 horizontal</p>
            {!selectedCourse && (
              <p className="text-sm text-slate-400 mt-1">Selecciona un curso para comenzar</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}