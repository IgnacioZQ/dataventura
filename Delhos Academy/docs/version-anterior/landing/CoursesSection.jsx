import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { api } from '@/api/client';

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const allCourses = await api.entities.Course.list();
      const activeCourses = allCourses.filter(c => c.status === 'active' || c.status === 'open_for_registration');
      const limitedCourses = activeCourses.slice(0, 3);
      setCourses(limitedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
    setLoading(false);
  };

  return (
    <section id="cursos" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3D59]">
            Cursos Destacados
          </h2>
          <p className="mt-4 text-slate-600">
            Todos nuestros cursos son en vivo y 100% online
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#2B7CB3]" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Próximamente nuevos cursos</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    to={createPageUrl(`CursoDetalle?id=${course.id}`)}
                    className="block group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#2B7CB3]/50 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.image_url || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-[#1E3D59] text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        En vivo
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-[#1E3D59] mb-2 group-hover:text-[#2B7CB3] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {course.duration && (
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </div>
                          )}
                          {(course.price !== undefined && course.price !== null) && (
                            <div className="flex items-center gap-2">
                              {course.price === 0 ? (
                                <span className="text-xl font-bold text-green-600">
                                  Gratis
                                </span>
                              ) : (
                                <>
                                  {(course.discount && course.discount > 0) && (
                                    <span className="text-xs text-slate-400 line-through">${course.price}</span>
                                  )}
                                  <span className="text-xl font-bold text-[#2B7CB3]">
                                    ${(course.discount && course.discount > 0) ? (course.price * (1 - course.discount / 100)).toFixed(0) : course.price}
                                  </span>
                                  {(course.discount && course.discount > 0) && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                      -{course.discount}%
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {course.available_spots && course.available_spots > 0 && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
                            <span className="text-sm font-bold text-amber-800">
                              ⚡ Solo {course.available_spots} cupos disponibles
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to={createPageUrl('Cursos')}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-[#2B7CB3] text-[#2B7CB3] hover:bg-[#2B7CB3] hover:text-white rounded-full px-8"
                >
                  Ver todos los cursos
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}