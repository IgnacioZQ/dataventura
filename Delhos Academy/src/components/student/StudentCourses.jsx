import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { api } from '@/api/client';

export default function StudentCourses({ onCourseSelect, studentData }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentCourses();
  }, [studentData]);

  const loadStudentCourses = async () => {
    if (!studentData?.course_id) {
      setLoading(false);
      return;
    }

    try {
      const [course, modules, lessons] = await Promise.all([
        api.entities.Course.filter({ id: studentData.course_id }),
        api.entities.CourseModule.filter({ course_id: studentData.course_id }),
        api.entities.CourseLesson.filter({ course_id: studentData.course_id })
      ]);

      if (course.length > 0) {
        const courseData = course[0];
        const completedLessons = lessons.filter(l => l.is_completed).length;
        const totalLessons = lessons.length;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        setCourses([{
          id: courseData.id,
          title: courseData.title,
          instructor: courseData.instructor_name || 'Instructor',
          progress: studentData.progress || progress,
          image: courseData.image_url || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=180&fit=crop',
          totalModules: modules.length,
          completedModules: modules.filter(m => !m.is_locked).length,
          meetLink: courseData.meet_link
        }]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">Mis Cursos</h3>
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">No estás inscrito en ningún curso aún</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow"
            >
              <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
              <div className="p-5">
                <h4 className="font-semibold text-[#1e3a5f]">{course.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{course.instructor}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <BookOpen className="w-4 h-4" />
                    {course.totalModules} módulos
                  </span>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="rounded-full text-[#2E6DB4] border-[#2E6DB4]/30"
                    onClick={() => onCourseSelect(course)}
                  >
                    Ver curso
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}