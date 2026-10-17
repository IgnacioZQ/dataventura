import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Globe, BookOpen } from 'lucide-react';
import { api } from '@/api/client';

export default function InstructorsSection() {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    api.entities.Instructor.filter({ status: 'active' }).then(setInstructors).catch(() => {});
  }, []);

  if (instructors.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#2B7CB3] text-sm font-semibold uppercase tracking-widest mb-3">
            Quiénes te enseñan
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3D59]">
            Nuestros Instructores
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Aprende con profesionales activos en la industria, con experiencia real en ciencia de datos y docencia.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-0">
                {/* Photo */}
                <div className="sm:w-44 sm:flex-shrink-0">
                  <div className="h-52 sm:h-full relative overflow-hidden bg-gradient-to-br from-[#1E3D59] to-[#2B7CB3]">
                    {instructor.profile_image ? (
                      <img
                        src={instructor.profile_image}
                        alt={instructor.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold opacity-30">
                        {instructor.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between p-6 flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-[#1E3D59]">{instructor.name}</h3>

                    {/* Specialties */}
                    {instructor.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {instructor.specialties.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[#2B7CB3]/10 text-[#2B7CB3] font-medium px-2.5 py-1 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bio */}
                    {instructor.bio && (
                      <p className="mt-3 text-slate-500 text-sm leading-relaxed line-clamp-4">
                        {instructor.bio}
                      </p>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50">
                    {instructor.linkedin && (
                      <a
                        href={instructor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2B7CB3] transition-colors font-medium"
                      >
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {instructor.website && (
                      <a
                        href={instructor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2B7CB3] transition-colors font-medium"
                      >
                        <Globe className="w-4 h-4" /> Sitio web
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}