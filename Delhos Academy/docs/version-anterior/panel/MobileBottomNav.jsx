import React from 'react';
import { Home, BookOpen, FileText, Calendar, MoreHorizontal, Megaphone } from 'lucide-react';

const mainItems = [
  { icon: Home, label: 'Inicio', view: 'home' },
  { icon: BookOpen, label: 'Curso', view: 'course' },
  { icon: FileText, label: 'Tareas', view: 'assignments' },
  { icon: Calendar, label: 'Horario', view: 'schedule' },
  { icon: Megaphone, label: 'Anuncios', view: 'announcements' },
];

export default function MobileBottomNav({ currentView, setCurrentView, unreadCounts = {} }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          const badge = unreadCounts[item.view] || 0;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all relative ${
                isActive ? 'text-[#2E6DB4]' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#2E6DB4]' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#2E6DB4] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}