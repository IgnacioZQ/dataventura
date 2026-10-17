import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function StudentHeader({ studentName, studentData, onSettingsClick }) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1e3a5f]">
              {getGreeting()}, {studentName || 'Estudiante'}
            </h1>
            <p className="text-sm text-slate-500">Bienvenido a tu portal de aprendizaje</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onSettingsClick}
              className="flex items-center gap-3 hover:bg-slate-50 rounded-lg p-1.5 transition-colors"
            >
              {studentData?.profile_image ? (
                <img 
                  src={studentData.profile_image} 
                  alt={studentName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#2E6DB4] cursor-pointer hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageDialogOpen(true);
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#2E6DB4] flex items-center justify-center text-white font-medium">
                  {studentName?.charAt(0) || 'E'}
                </div>
              )}
              <Settings className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <img 
            src={studentData?.profile_image} 
            alt={studentName}
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}