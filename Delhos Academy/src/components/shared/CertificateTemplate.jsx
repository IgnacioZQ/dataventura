import React from 'react';

export const CERT_W = 1000;
export const CERT_H = 707;

export const injectCertFonts = () => {
  if (!document.getElementById('cert-fonts')) {
    const link = document.createElement('link');
    link.id = 'cert-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Playfair+Display:ital,wght@0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
  }
};

export const formatCertDate = () => {
  const months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')} DE ${months[d.getMonth()]} DEL ${d.getFullYear()}`;
};

const CertificateTemplate = React.forwardRef(({ studentName, courseName, courseHours }, ref) => {
  const date = formatCertDate();

  return (
    <div ref={ref} style={{
      width: `${CERT_W}px`,
      height: `${CERT_H}px`,
      position: 'relative',
      backgroundColor: '#FAFAF8',
      overflow: 'hidden',
      fontFamily: '"Montserrat", sans-serif',
    }}>

      {/* Left accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: '7px',
        background: 'linear-gradient(180deg, #16202C 0%, #1E4E86 50%, #2E6DB4 100%)',
        zIndex: 2,
      }} />

      {/* Top-right corner ornament */}
      <svg style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }} width="220" height="180" viewBox="0 0 220 180">
        <polygon points="220,0 220,180 0,0" fill="#16202C" opacity="0.04"/>
        <polygon points="220,0 220,120 60,0" fill="#1E4E86" opacity="0.05"/>
      </svg>

      {/* Bottom-left corner ornament */}
      <svg style={{ position: 'absolute', bottom: 0, left: 7, zIndex: 1 }} width="260" height="200" viewBox="0 0 260 200">
        <polygon points="0,200 260,200 0,0" fill="#16202C" opacity="0.04"/>
        <polygon points="0,200 160,200 0,80" fill="#1E4E86" opacity="0.05"/>
      </svg>

      {/* Outer border frame */}
      <div style={{
        position: 'absolute',
        top: '24px', left: '36px', right: '24px', bottom: '24px',
        border: '1px solid rgba(27, 80, 137, 0.15)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Inner border frame */}
      <div style={{
        position: 'absolute',
        top: '30px', left: '42px', right: '30px', bottom: '30px',
        border: '0.5px solid rgba(27, 80, 137, 0.08)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        position: 'absolute',
        top: 0, left: '7px', right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '50px',
        paddingBottom: '50px',
        paddingLeft: '90px',
        paddingRight: '70px',
        boxSizing: 'border-box',
        zIndex: 3,
      }}>

        {/* Top label */}
        <div style={{
          fontSize: '10px',
          fontWeight: '500',
          color: '#2E6DB4',
          letterSpacing: '5px',
          fontFamily: '"Montserrat", sans-serif',
          textTransform: 'uppercase',
          marginBottom: '18px',
        }}>
          Delhos Academy
        </div>

        {/* Thin divider */}
        <div style={{
          width: '40px',
          height: '1px',
          background: '#2E6DB4',
          marginBottom: '18px',
          opacity: 0.5,
        }} />

        {/* CERTIFICADO */}
        <div style={{
          fontSize: '72px',
          fontWeight: '700',
          color: '#16202C',
          letterSpacing: '10px',
          fontFamily: '"Playfair Display", serif',
          lineHeight: '1',
          marginBottom: '6px',
          textTransform: 'uppercase',
        }}>
          CERTIFICADO
        </div>

        {/* DE PARTICIPACIÓN */}
        <div style={{
          fontSize: '11px',
          fontWeight: '300',
          color: '#1E4E86',
          letterSpacing: '8px',
          fontFamily: '"Montserrat", sans-serif',
          textTransform: 'uppercase',
          marginBottom: '38px',
        }}>
          de participación
        </div>

        {/* OTORGADO A */}
        <div style={{
          fontSize: '9px',
          fontWeight: '500',
          color: '#9CA3AF',
          letterSpacing: '4px',
          fontFamily: '"Montserrat", sans-serif',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          Otorgado a
        </div>

        {/* Student name */}
        <div style={{
          fontSize: '56px',
          fontWeight: '400',
          fontStyle: 'italic',
          color: '#16202C',
          fontFamily: '"Cormorant Garamond", serif',
          lineHeight: '1.15',
          textAlign: 'center',
          marginBottom: '6px',
          letterSpacing: '1px',
        }}>
          {studentName || 'Nombre Apellido'}
        </div>

        {/* Name underline */}
        <div style={{
          width: '320px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #1E4E86 30%, #1E4E86 70%, transparent)',
          marginBottom: '32px',
          opacity: 0.4,
        }} />

        {/* Body text */}
        <div style={{
          fontSize: '13px',
          fontWeight: '300',
          color: '#4B5563',
          fontFamily: '"Cormorant Garamond", serif',
          lineHeight: '2',
          textAlign: 'center',
          maxWidth: '640px',
          letterSpacing: '0.3px',
        }}>
          Por haber completado satisfactoriamente el programa{' '}
          <span style={{ fontStyle: 'italic', color: '#16202C', fontWeight: '400' }}>
            &ldquo;{courseName || 'Nombre del Curso'}&rdquo;
          </span>
          {', '}correspondiente a{' '}
          <span style={{ fontWeight: '600', color: '#1E4E86' }}>{courseHours || '40'} horas cronológicas</span>
          {' '}de formación en ciencia de datos aplicada.
        </div>

        {/* Date */}
        <div style={{
          fontSize: '9.5px',
          fontWeight: '400',
          color: '#9CA3AF',
          fontFamily: '"Montserrat", sans-serif',
          marginTop: '24px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          {date}
        </div>

        {/* Spacer */}
        <div style={{ marginTop: '36px' }} />

      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';
export default CertificateTemplate;