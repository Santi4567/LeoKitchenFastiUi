// src/components/tables/TableGrid.tsx
import React from 'react';
import { Table } from '../../types/table';

interface TableGridProps {
  tables: Table[];
  canOpenTables: boolean;
  onTableClick: (tableId: number, status: number) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, canOpenTables, onTableClick }) => {
  if (tables.length === 0) {
    return (
      <div className="text-center py-20 bg-[#25272a]/30 rounded-[2rem] border-2 border-dashed border-white/10">
        <p className="text-[#fff2df]/50 font-bold text-xl">No hay mesas en esta área.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {tables.map((table) => {
        const isLibre = table.status === 0;
        
        return (
          <button
            key={table.id}
            onClick={() => {
              if (!canOpenTables) alert("No tienes permiso para abrir mesas.");
              else onTableClick(table.id, table.status);
            }}
            className={`relative p-5 h-32 rounded-[2rem] flex flex-col justify-between text-left shadow-lg transition-all duration-200 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-[#ff8a00]/50
              ${isLibre 
                ? 'bg-[#fff2df] text-[#18191b] hover:bg-white' 
                : 'bg-[#ff8a00] text-[#18191b] hover:brightness-110'}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-3xl font-black">{table.name.replace('Mesa ', '')}</span>
              <div className={`p-2 rounded-xl ${isLibre ? 'bg-black/5' : 'bg-black/15'}`}>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                 </svg>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                {table.name}
              </p>
              <p className="text-sm font-black mt-1">
                {isLibre ? 'Disponible' : 'En Servicio'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};