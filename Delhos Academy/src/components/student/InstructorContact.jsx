import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, X } from 'lucide-react';
import { api } from '@/api/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function InstructorContact({ studentData }) {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    loadInstructor();
  }, [studentData]);

  const loadInstructor = async () => {
    if (!studentData?.instructor_email) {
      setLoading(false);
      return;
    }

    try {
      const instructors = await api.entities.Instructor.filter({ 
        email: studentData.instructor_email 
      });
      if (instructors.length > 0) {
        setInstructor(instructors[0]);
      }
    } catch (error) {
      console.error('Error loading instructor:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  if (!instructor) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Contacto del Instructor</h3>
      
      <div className="flex items-center gap-4">
        {instructor.profile_image ? (
          <img 
            src={instructor.profile_image} 
            alt={instructor.name} 
            className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowImageModal(true)}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#2E6DB4]/20 flex items-center justify-center text-2xl font-bold text-[#1e3a5f]">
            {instructor.name.charAt(0)}
          </div>
        )}
        
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">{instructor.name}</h4>
          <div className="flex items-center gap-2 mt-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <a 
              href={`mailto:${instructor.email}`}
              className="text-sm text-[#2E6DB4] hover:underline"
            >
              {instructor.email}
            </a>
          </div>
        </div>
      </div>

      {/* Modal para ampliar imagen */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <div className="relative">
            <button 
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={instructor.profile_image} 
              alt={instructor.name}
              className="w-full h-auto"
            />
            <div className="bg-white p-4 text-center">
              <p className="font-semibold text-lg text-slate-800">{instructor.name}</p>
              <p className="text-sm text-slate-500">{instructor.email}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}