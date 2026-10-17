import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function InstructorHeader({ instructorName = 'Instructor', instructorData, onSettingsClick }) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1e3a5f]">
              Panel del Instructor
            </h1>
            <p className="text-sm text-slate-500">Gestiona tus cursos y estudiantes</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onSettingsClick}
              className="flex items-center gap-3 hover:bg-slate-50 rounded-lg p-2 transition-colors"
            >
              {instructorData?.profile_image ? (
                <img 
                  src={instructorData.profile_image} 
                  alt={instructorName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#1e3a5f] cursor-pointer hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageDialogOpen(true);
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-medium">
                  {instructorName?.charAt(0) || 'I'}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">{instructorName}</p>
                <p className="text-xs text-slate-400">Instructor</p>
              </div>
              <Settings className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <img 
            src={instructorData?.profile_image} 
            alt={instructorName}
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}