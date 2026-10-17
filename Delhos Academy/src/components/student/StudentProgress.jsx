import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Award, Target, Zap, Rocket, Trophy } from 'lucide-react';

const BADGES_CONFIG = {
  first_class: { name: 'Primera Clase', icon: '🎯', color: 'bg-blue-100 text-blue-600' },
  streak_3: { name: 'Racha de 3', icon: '🔥', color: 'bg-orange-100 text-orange-600' },
  streak_5: { name: 'Racha de 5', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
  streak_10: { name: 'Imparable', icon: '🚀', color: 'bg-[#EAF2FB] text-[#1E4E86]' },
  perfect_month: { name: 'Mes Perfecto', icon: '🏆', color: 'bg-green-100 text-green-600' }
};

export default function StudentProgress({ studentData }) {
  const streak = studentData?.streak || 0;
  const badges = studentData?.badges || [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center"
      >
        <div className="text-6xl mb-2">🔥</div>
        <p className="text-white/80 text-sm mb-1">Racha de asistencia</p>
        <h2 className="text-5xl font-bold mb-2">{streak}</h2>
        <p className="text-white/70 text-sm">
          {streak === 0 ? '¡Asiste a tu próxima clase para comenzar!' : 
           streak === 1 ? '¡Sigue así!' : 
           streak < 5 ? '¡Mantén el ritmo!' : 
           '¡Imparable!'}
        </p>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#2E6DB4]" />
          <h3 className="font-semibold text-[#1e3a5f]">Mis Insignias</h3>
        </div>

        {badges.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            ¡Asiste a clases para ganar tu primera insignia!
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {badges.map(badgeId => {
              const badge = BADGES_CONFIG[badgeId];
              if (!badge) return null;
              return (
                <div
                  key={badgeId}
                  className={`px-3 py-2 rounded-full ${badge.color} text-sm font-medium flex items-center gap-2`}
                >
                  <span>{badge.icon}</span>
                  {badge.name}
                </div>
              );
            })}
          </div>
        )}

        {/* Locked badges */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-3">Por desbloquear:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BADGES_CONFIG)
              .filter(([id]) => !badges.includes(id))
              .map(([id, badge]) => (
                <div
                  key={id}
                  className="px-3 py-2 rounded-full bg-slate-100 text-slate-400 text-sm flex items-center gap-2"
                >
                  <span className="grayscale">{badge.icon}</span>
                  {badge.name}
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}