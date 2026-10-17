import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Award, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const MONTHS = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

function getCertDate() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')} DE ${MONTHS[d.getMonth()]} DEL ${d.getFullYear()}`;
}

// Helper: render spaced text centered correctly by drawing letter-by-letter
function centeredSpacedText(pdf, text, x, y, charSpaceMm) {
  const chars = text.split('');
  const totalW = chars.reduce((sum, ch) => sum + pdf.getTextWidth(ch), 0) + charSpaceMm * (chars.length - 1);
  let curX = x - totalW / 2;
  chars.forEach((ch, i) => {
    pdf.text(ch, curX, y);
    curX += pdf.getTextWidth(ch) + (i < chars.length - 1 ? charSpaceMm : 0);
  });
}

function generateCertPDF({ studentName, courseName, courseHours }) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210;
  const CX = W / 2; // true center; accent bar is decorative, text centering uses full width

  // Background
  pdf.setFillColor(250, 250, 248);
  pdf.rect(0, 0, W, H, 'F');

  // Left accent bar
  pdf.setFillColor(10, 25, 41);
  pdf.rect(0, 0, 2, H, 'F');
  pdf.setFillColor(27, 80, 137);
  pdf.rect(2, H / 3, 2, H / 3, 'F');
  pdf.setFillColor(43, 124, 179);
  pdf.rect(4, (H * 2) / 3, 2, H / 3, 'F');

  // Outer border
  pdf.setDrawColor(27, 80, 137);
  pdf.setLineWidth(0.2);
  pdf.setGState(pdf.GState({ opacity: 0.2 }));
  pdf.rect(10, 7, W - 17, H - 14);
  pdf.setLineWidth(0.1);
  pdf.setGState(pdf.GState({ opacity: 0.1 }));
  pdf.rect(12, 9, W - 21, H - 18);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // DELHOS ACADEMY — manually spaced so centering is exact
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

  // CERTIFICADO — manually spaced
  pdf.setFont('times', 'bold');
  pdf.setFontSize(36);
  pdf.setTextColor(10, 25, 41);
  centeredSpacedText(pdf, 'CERTIFICADO', CX, 48, 3.5);

  // DE PARTICIPACIÓN — manually spaced
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(27, 80, 137);
  centeredSpacedText(pdf, 'DE PARTICIPACIÓN', CX, 57, 2.5);

  // OTORGADO A — manually spaced
  pdf.setFontSize(6);
  pdf.setTextColor(156, 163, 175);
  centeredSpacedText(pdf, 'OTORGADO A', CX, 70, 2);

  // Student name — no charspace needed, normal centered
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

  // Body text
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

  // Date — manually spaced, centered correctly
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(156, 163, 175);
  centeredSpacedText(pdf, getCertDate(), CX, 192, 2);

  return pdf;
}

export default function StudentCertificateDownload({ studentData }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const studentName = studentData?.nombre_completo || studentData?.name || 'Estudiante';
  const courseName = studentData?.course_name || 'Curso';
  const courseHours = studentData?.certificate_hours || 40;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const pdf = generateCertPDF({ studentName, courseName, courseHours });
      const safeName = studentName.replace(/\s+/g, '_');
      pdf.save(`Certificado_${safeName}.pdf`);
      toast.success('Certificado descargado.');
    } catch (err) {
      toast.error('Error al generar el certificado: ' + err.message);
      console.error(err);
    }
    setIsGenerating(false);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="bg-[#1E3A5F] rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-white/5 rounded-full translate-y-12" />
        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
          <Award className="size-14 flex-shrink-0 text-white/90" strokeWidth={1.4} aria-hidden />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold">¡Tu certificado está listo!</h2>
            <p className="text-white/70 text-sm mt-1">
              Has completado el curso <span className="text-white font-semibold">"{courseName}"</span>.<br className="hidden sm:block" />
              Descarga tu diploma oficial de Delhos Academy.
            </p>
          </div>
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-white text-[#1e3a5f] hover:bg-white/90 font-bold px-6 py-5 rounded-xl shadow-lg flex-shrink-0 text-base"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generando...</>
            ) : (
              <><Download className="w-5 h-5 mr-2" /> Descargar certificado</>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}