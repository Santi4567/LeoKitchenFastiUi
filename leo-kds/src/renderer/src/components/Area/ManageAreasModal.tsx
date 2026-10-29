// src/components/area/ManageAreasModal.tsx
import React, { useState } from 'react';
import { Area } from '../../types/table';
import { tableService } from '../../services/tableService';
import { useToast } from '../../context/ToastContext'; // <-- Importamos el Toast

type ViewState = 'MENU' | 'ADD_AREA' | 'MANAGE';

interface Props {
  areas: Area[];
  onClose: () => void;
  onRefresh: () => void;
}

export const ManageAreasModal: React.FC<Props> = ({ areas, onClose, onRefresh }) => {
  const { showToast } = useToast(); // <-- Inicializamos el Toast
  const [view, setView] = useState<ViewState>('MENU');
  
  // Estados
  const [newAreaName, setNewAreaName] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | null>(areas[0] || null);
  const [editAreaName, setEditAreaName] = useState('');
  const [newTableName, setNewTableName] = useState('');

  // --- ÁREAS ---
  const handleCreateArea = async () => {
    if (!newAreaName.trim()) return;
    try {
      await tableService.createArea(newAreaName);
      showToast(`Área '${newAreaName}' creada con éxito`, 'success');
      setNewAreaName('');
      onRefresh();
      setView('MENU');
    } catch (err: any) {
      showToast(err.message, 'error'); // Mostrará el mensaje exacto del backend C#
    }
  };

  const handleUpdateArea = async () => {
    if (!selectedArea || !editAreaName.trim()) return;
    try {
      await tableService.updateArea(selectedArea.id, editAreaName);
      showToast("Área actualizada correctamente", 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteArea = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta área?")) return;
    try {
      await tableService.deleteArea(id);
      showToast("Área eliminada", 'success');
      onRefresh();
      setSelectedArea(null);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // --- MESAS ---
  const handleCreateTable = async () => {
    if (!selectedArea || !newTableName.trim()) return;
    try {
      await tableService.createTable(newTableName, selectedArea.id);
      showToast(`Mesa '${newTableName}' creada`, 'success');
      setNewTableName('');
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (!window.confirm("¿Eliminar mesa?")) return;
    try {
      await tableService.deleteTable(id);
      showToast("Mesa eliminada", 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  React.useEffect(() => {
    if (selectedArea) {
      const updatedArea = areas.find(a => a.id === selectedArea.id);
      if (updatedArea) setSelectedArea(updatedArea);
    }
  }, [areas]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#18191b] border-2 border-white/10 w-full max-w-4xl rounded-[3rem] p-8 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-4">
            {view !== 'MENU' && (
              <button onClick={() => setView('MENU')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              </button>
            )}
            <h2 className="text-3xl font-black text-[#fff2df]">
              {view === 'MENU' ? 'Gestión de Salón' : view === 'ADD_AREA' ? 'Dar de alta Área' : 'Administrar Áreas'}
            </h2>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-[#ff8a00] hover:text-[#18191b] rounded-2xl transition-colors outline-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="flex-1 overflow-y-auto min-h-[400px]">
          
          {view === 'MENU' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
             <button onClick={() => setView('ADD_AREA')} className="flex flex-col items-center justify-center p-12 bg-[#25272a] rounded-[2rem] hover:bg-[#ff8a00] hover:text-[#18191b] text-[#ff8a00] transition-all group outline-none h-64 border border-white/5 hover:border-transparent">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span className="text-2xl font-black">Agregar Área</span>
               <span className="text-sm font-bold opacity-70 mt-2">Dar de alta un nuevo espacio</span>
             </button>

             <button onClick={() => { setView('MANAGE'); setSelectedArea(areas[0] || null); }} className="flex flex-col items-center justify-center p-12 bg-[#25272a] rounded-[2rem] hover:bg-[#ff8a00] hover:text-[#18191b] text-[#ff8a00] transition-all group outline-none h-64 border border-white/5 hover:border-transparent">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
               <span className="text-2xl font-black">Administrar Áreas</span>
               <span className="text-sm font-bold opacity-70 mt-2">Renombrar, agregar y eliminar mesas</span>
             </button>
           </div>
          )}

          {view === 'ADD_AREA' && (
             <div className="flex flex-col justify-center items-center h-full max-w-lg mx-auto">
             <div className="w-full bg-[#25272a] p-8 rounded-[2rem] border border-white/5">
               <label className="block text-[#f3701e] font-black text-xl mb-4">Nombre de la nueva área</label>
               <input 
                 type="text" 
                 autoFocus
                 placeholder="Ej. Terraza Norte" 
                 value={newAreaName}
                 onChange={(e) => setNewAreaName(e.target.value)}
                 className="w-full bg-[#18191b] text-white p-5 text-lg rounded-2xl mb-8 border-2 border-white/10 focus:border-[#ff8a00] outline-none"
               />
               <button onClick={handleCreateArea} disabled={!newAreaName.trim()} className="w-full py-5 bg-[#ff8a00] text-[#18191b] font-black text-lg rounded-2xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">
                 Guardar Área
               </button>
             </div>
           </div>
          )}

          {view === 'MANAGE' && (
            // Cambio clave: Usamos GRID de 12 columnas en lugar de anchos manuales con flex
            <div className="grid grid-cols-12 gap-8 h-full min-h-[400px]">
              
              {/* Columna Izquierda: Lista de Áreas (4 de 12 columnas) */}
              <div className="col-span-12 md:col-span-4 flex flex-col gap-3 overflow-y-auto pr-2">
                {areas.length === 0 ? (
                  <p className="text-white/40 text-sm font-bold p-4">No hay áreas creadas.</p>
                ) : (
                  areas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => { setSelectedArea(area); setEditAreaName(area.name); }}
                      className={`p-5 rounded-2xl text-left font-black transition-colors outline-none
                        ${selectedArea?.id === area.id ? 'bg-[#ff8a00] text-[#18191b]' : 'bg-[#25272a] text-[#fff2df] hover:bg-white/10'}`}
                    >
                      {area.name}
                    </button>
                  ))
                )}
              </div>

              {/* Columna Derecha: Detalles del Área (8 de 12 columnas) */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-6 overflow-y-auto pl-2">
                {selectedArea ? (
                  <>
                    {/* Sección Renombrar Área */}
                    <div className="bg-[#25272a] p-6 rounded-[2rem] border border-white/5">
                      <div className="flex flex-col xl:flex-row gap-4">
                        <input 
                          type="text" 
                          value={editAreaName}
                          onChange={(e) => setEditAreaName(e.target.value)}
                          className="flex-1 bg-[#18191b] text-white p-4 rounded-2xl border border-white/10 focus:border-[#ff8a00] outline-none font-bold"
                        />
                        <div className="flex gap-4">
                          <button onClick={handleUpdateArea} className="flex-1 xl:flex-none px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-[#ff8a00] hover:text-[#18191b] transition-colors">
                            Renombrar
                          </button>
                          <button onClick={() => handleDeleteArea(selectedArea.id)} className="flex-1 xl:flex-none px-8 py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-colors">
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sección Mesas */}
                    <div className="bg-[#25272a] p-6 rounded-[2rem] border border-white/5">
                      <h3 className="text-xl font-bold text-[#f3701e] mb-4">Mesas en {selectedArea.name}</h3>
                      
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <input 
                          type="text" 
                          placeholder="Nueva Mesa (Ej. Mesa 5)" 
                          value={newTableName}
                          onChange={(e) => setNewTableName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateTable()}
                          className="flex-1 bg-[#18191b] text-white p-4 rounded-2xl border border-white/10 focus:border-[#ff8a00] outline-none"
                        />
                        <button onClick={handleCreateTable} disabled={!newTableName.trim()} className="px-8 py-4 sm:py-0 bg-[#ff8a00] text-[#18191b] font-black rounded-2xl active:scale-95 disabled:opacity-50 transition-all">
                          Añadir
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {selectedArea.tables.length === 0 && (
                          <p className="col-span-full text-white/40 text-sm font-bold">No hay mesas en esta área.</p>
                        )}
                        {selectedArea.tables.map(t => (
                          <div key={t.id} className="flex justify-between items-center bg-[#18191b] pl-4 pr-2 py-2 rounded-2xl border border-white/5 group">
                            <span className="font-bold text-[#fff2df]">{t.name}</span>
                            <button onClick={() => handleDeleteTable(t.id)} className="text-red-500/50 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-colors opacity-100 xl:opacity-0 xl:group-hover:opacity-100">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-white/30 font-bold">
                    Selecciona un área de la lista izquierda
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};