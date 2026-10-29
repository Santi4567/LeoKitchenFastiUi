// src/components/area/AreaSelector.tsx
import React from 'react';
import { Area } from '../../types/table';

interface AreaSelectorProps {
  areas: Area[];
  selectedAreaId: number | null;
  onSelectArea: (areaId: number) => void;
  canManageAreas: boolean;
  onManageClick: () => void;
}

export const AreaSelector: React.FC<AreaSelectorProps> = ({
  areas,
  selectedAreaId,
  onSelectArea,
  canManageAreas,
  onManageClick,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {areas.map((area) => {
        const isSelected = selectedAreaId === area.id;
        // Calculamos cuántas mesas están libres (status === 0)
        const mesasLibres = area.tables.filter(t => t.status === 0).length;

        return (
          <button
            key={area.id}
            onClick={() => onSelectArea(area.id)}
            className={`flex flex-col px-6 py-4 rounded-3xl transition-all duration-200 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-[#ff8a00]/50
              ${isSelected 
                ? 'bg-[#ff8a00] text-[#18191b] shadow-lg scale-105' 
                : 'bg-[#25272a] text-[#fff2df]/70 hover:bg-white/5 border border-white/5'}`}
          >
            <span className="text-xl font-black">{area.name}</span>
            <span className={`text-xs font-bold mt-1 ${isSelected ? 'text-[#18191b]/70' : 'text-[#f3701e]'}`}>
              {mesasLibres} libres de {area.tables.length}
            </span>
          </button>
        );
      })}

      {/* Botón de Administración de Áreas (Solo visible si tiene el permiso) */}
      {canManageAreas && (
        <button
          onClick={onManageClick}
          className="ml-auto flex items-center gap-2 px-6 py-4 rounded-3xl bg-black/40 text-[#fff2df]/60 hover:text-[#fff2df] border border-dashed border-white/20 hover:border-[#ff8a00]/50 hover:bg-[#ff8a00]/10 transition-all active:scale-95 outline-none"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="font-bold text-sm tracking-wide">Gestionar Áreas</span>
        </button>
      )}
    </div>
  );
};