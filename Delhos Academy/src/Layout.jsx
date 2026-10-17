import React, { useLayoutEffect } from 'react';

export default function Layout({ children, currentPageName }) {
  useLayoutEffect(() => {
    // SEO Meta Tags Configuration
    const seoConfig = {
      'Home': {
        title: 'Delhos Academy · Ciencia de datos e IA con clases en vivo',
        description: 'Formación práctica en ciencia de datos, inteligencia artificial y analítica aplicada a problemas reales, con clases en vivo 100% online, grabaciones y certificado.',
        keywords: 'cursos ciencia de datos, data science online, inteligencia artificial, python, sql, machine learning, clases en vivo'
      },
      'Cursos': {
        title: 'Cursos · Delhos Academy',
        description: 'Cursos en vivo de ciencia de datos, machine learning y analítica. Todos quedan grabados e incluyen certificado. Filtra por nivel o busca un tema.',
        keywords: 'cursos data science, curso python, curso sql, curso machine learning, curso análisis de datos'
      },
      'CursoDetalle': {
        title: 'Curso · Delhos Academy',
        description: 'Temario, metodología, instructor y valor del curso. Clases en vivo, grabaciones y certificado.',
        keywords: 'curso ciencia de datos, temario, delhos academy'
      },
      'Inscripcion': {
        title: 'Postulación · Delhos Academy',
        description: 'Postula a un curso o inscríbete a un evento de Delhos Academy en tres pasos. Postular no te compromete a pagar.',
        keywords: 'postular curso, inscripción delhos academy'
      },
      'Webinars': {
        title: 'Webinars y workshops · Delhos Academy',
        description: 'Sesiones breves en vivo para aprender algo concreto: webinars para escuchar y preguntar, workshops para practicar.',
        keywords: 'webinar ciencia de datos, workshop datos, eventos en vivo'
      },
      'WebinarDetalle': {
        title: 'Evento · Delhos Academy',
        description: 'Fecha, temas e instructor del webinar o workshop.',
        keywords: 'webinar, workshop, delhos academy'
      },
      'Nosotros': {
        title: 'Quiénes somos · Delhos Academy',
        description: 'Academia online de ciencia de datos, IA y analítica, parte del ecosistema Delhos. Clases en vivo, proyectos prácticos y acompañamiento continuo.',
        keywords: 'academia ciencia de datos, delhos, quiénes somos'
      },
      'Acceso': {
        title: 'Iniciar sesión · Delhos Academy',
        description: 'Acceso para estudiantes e instructores de Delhos Academy: clases en vivo, grabaciones, tareas y mensajes.',
        keywords: 'login delhos academy, plataforma estudiantes'
      },
      'Contacto': {
        title: 'Contacto · Delhos Academy',
        description: 'Escríbenos sobre un curso, tu inscripción o los webinars. Te respondemos a la brevedad.',
        keywords: 'contacto delhos academy'
      },
      'StudentDashboard': {
        title: 'Mi panel · Delhos Academy',
        description: 'Tus clases, tareas y avances en un solo lugar.',
        keywords: 'panel estudiante'
      },
      'InstructorDashboard': {
        title: 'Panel de instructor · Delhos Academy',
        description: 'Gestiona tus cursos, estudiantes y clases.',
        keywords: 'panel instructor'
      }
    };

    const config = seoConfig[currentPageName] || seoConfig['Home'];
    
    // Update page title
    document.title = config.title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = config.description;
    
    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = config.keywords;

    // Open Graph tags for social media
    const ogTags = [
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'es_CL' }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description }
    ];

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = tag.name;
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });

    // Add robots meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = ['Acceso', 'StudentDashboard', 'InstructorDashboard'].includes(currentPageName) ? 'noindex, nofollow' : 'index, follow';

    // Add language meta tag
    let metaLanguage = document.querySelector('meta[http-equiv="content-language"]');
    if (!metaLanguage) {
      metaLanguage = document.createElement('meta');
      metaLanguage.setAttribute('http-equiv', 'content-language');
      document.head.appendChild(metaLanguage);
    }
    metaLanguage.content = 'es';

    // Add viewport if not exists
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      document.head.appendChild(metaViewport);
    }
    metaViewport.content = 'width=device-width, initial-scale=1.0';

  }, [currentPageName]);

  return <>{children}</>;
}