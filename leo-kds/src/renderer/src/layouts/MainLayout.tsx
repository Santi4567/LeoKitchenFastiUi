// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

// 1. DESCOMENTA LA IMPORTACIÓN AQUÍ
import TablesScreen from '../pages/TablesScreen';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState('TABLES');

  const renderView = () => {
    switch (currentView) {
      // 2. DESCOMENTA ESTA LÍNEA
      case 'TABLES': return <TablesScreen />;
      
      // Los demás se quedan comentados hasta que los creemos
      // case 'KDS': return <KdsScreen />;
      // case 'GRILL': return <GrillScreen />;
      // case 'REPORTS': return <ReportsScreen />;
      // case 'USERS': return <UsersScreen />;
      
      default: 
        return (
          <div className="flex-1 border-4 border-dashed border-[#ff8a00]/20 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-4xl font-black text-[#fff2df] opacity-40">Estación: {currentView}</h1>
            <p className="text-[#ff8a00] font-bold mt-2">La vista se está construyendo...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full h-screen bg-[#18191b] overflow-hidden select-none font-sans">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 p-4 pl-0 flex flex-col relative overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};

export default MainLayout;