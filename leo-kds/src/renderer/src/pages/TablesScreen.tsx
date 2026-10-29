import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { tableService } from '../services/tableService';
import { Area } from '../types/table';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/hasPermission';
import { AreaSelector } from '../components/area/AreaSelector';
import { TableGrid } from '../components/tables/TableGrid';
import { ManageAreasModal } from '../components/area/ManageAreasModal';
import { useTableSignalR } from '../hooks/useTableSignalR';

const TablesScreen: React.FC = () => {
  const { user } = useAuth();
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);

  const canOpenTables = hasPermission(user, 'open.tables');
  const canManageAreas = hasPermission(user, 'manage.areas');

  const fetchMesas = async () => {
    const data = await tableService.getAreasWithTables();
    setAreas(data);
    if (data.length > 0 && !selectedAreaId) setSelectedAreaId(data[0].id);
  };

  useEffect(() => {
    fetchMesas().then(() => setIsLoading(false));
  }, []);

  // --- INTEGRACIÓN SIGNALR ---
  // Esta función se ejecuta sola cuando OTRO mesero abre o cierra una mesa
  const handleRealTimeUpdate = useCallback((tableId: number, status: number) => {
    setAreas(prevAreas => prevAreas.map(area => ({
      ...area,
      tables: area.tables.map(table => table.id === tableId ? { ...table, status } : table)
    })));
  }, []);

  const { isConnected } = useTableSignalR(handleRealTimeUpdate);

  // Filtrar mesas del área actual
  const currentTables = useMemo(() => {
    return areas.find(a => a.id === selectedAreaId)?.tables || [];
  }, [areas, selectedAreaId]);

  // --- ACCIÓN DEL MESERO ---
  const handleTableClick = async (tableId: number, status: number) => {
    if (status === 1) {
      console.log("Navegando a la comanda de la mesa", tableId);
      // navigation.navigate('POS', { tableId })
      return;
    }

    // Si está libre, la intentamos abrir
    const coversStr = prompt("¿Cuántos comensales (covers) son?");
    const covers = parseInt(coversStr || '0', 10);
    
    if (covers > 0) {
      // Optimizacion Optimista (cambiamos el color al instante para que el mesero no espere)
      handleRealTimeUpdate(tableId, 1);
      
      const success = await tableService.openTable(tableId, covers);
      if (!success) {
        // Si falló el servidor, la regresamos a verde
        handleRealTimeUpdate(tableId, 0);
        alert("Error al abrir la mesa. Intenta de nuevo.");
      }
    }
  };

  if (isLoading) return <div className="flex-1 flex justify-center items-center"><div className="w-12 h-12 border-4 border-[#ff8a00]/30 border-t-[#ff8a00] rounded-full animate-spin"></div></div>;

  return (
    <div className="flex-1 p-8 overflow-y-auto flex flex-col relative">
      <header className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <span className="text-xs font-black tracking-widest text-[#f3701e] uppercase bg-[#f3701e]/10 px-4 py-1.5 rounded-full mb-3 inline-block">
            {isConnected ? '🟢 En Vivo' : '🔴 Conectando...'}
          </span>
          <h1 className="text-5xl font-black text-[#fff2df] tracking-tight">Mapa de Mesas</h1>
        </div>
      </header>

      {areas.length > 0 ? (
        <>
          <AreaSelector 
            areas={areas}
            selectedAreaId={selectedAreaId}
            onSelectArea={setSelectedAreaId}
            canManageAreas={canManageAreas}
            onManageClick={() => setShowManageModal(true)}
          />
          <div className="flex-1 bg-[#25272a]/40 p-6 rounded-[2.5rem] border border-white/5 overflow-y-auto">
            <TableGrid tables={currentTables} canOpenTables={canOpenTables} onTableClick={handleTableClick} />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          {canManageAreas && (
            <button onClick={() => setShowManageModal(true)} className="px-8 py-4 rounded-full bg-[#ff8a00] text-[#18191b] font-black">Crear mi primera área</button>
          )}
        </div>
      )}

      {/* MODAL */}
      {showManageModal && (
        <ManageAreasModal 
          areas={areas} 
          onClose={() => setShowManageModal(false)} 
          onRefresh={fetchMesas} 
        />
      )}
    </div>
  );
};

export default TablesScreen;