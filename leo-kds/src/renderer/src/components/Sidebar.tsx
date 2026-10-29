// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/hasPermission'; // El helper que creamos antes
import { PermisoKey } from '../types/auth';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Módulos operativos según los permisos del KDS
  const menuItems: Array<{ id: string; label: string; show: boolean; icon: React.ReactNode }> = [
    { 
      id: 'TABLES', 
      label: 'Salón y Mesas', 
      show: hasPermission(user, 'view.tables' as PermisoKey), 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
      ) 
    },
    { 
      id: 'KDS', 
      label: 'Cocina KDS', 
      show: hasPermission(user, 'view.kds' as PermisoKey), 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ) 
    },
    { 
      id: 'GRILL', 
      label: 'Cortes/Parrilla', 
      show: hasPermission(user, 'weigh.items' as PermisoKey), 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0l-3.75-3.75M12 20.25l3.75-3.75M3 7.5h18" /></svg>
      ) 
    },
    { 
      id: 'REPORTS', 
      label: 'Cortes de Caja', 
      show: hasPermission(user, 'view.reports' as PermisoKey), 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
      ) 
    },
    { 
      id: 'USERS', 
      label: 'Personal', 
      show: hasPermission(user, 'add.users' as PermisoKey), 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
      ) 
    }
  ];

  // Movimiento de texto igual al del otro proyecto[cite: 11]
  const labelMotion = isExpanded
    ? 'opacity-100 translate-x-0 duration-200 delay-100'
    : 'opacity-0 -translate-x-2 duration-100';

  return (
    <aside 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      // Colores de cápsula oscura para encajar en el KDS
      className={`bg-[#25272a] m-4 h-[calc(100vh-2rem)] rounded-[2rem] shadow-2xl flex flex-col py-6 transition-[width] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] relative z-40 border border-white/5
        ${isExpanded ? 'w-64' : 'w-[4.5rem]'}`}
    >
      
      {/* 1. SECCIÓN SUPERIOR: Menú[cite: 11] */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [overflow-anchor:none] flex flex-col space-y-3 px-3">
        {menuItems.map((item) =>
          item.show && (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center p-3 rounded-[1.25rem] transition-colors duration-200 group relative overflow-hidden shrink-0 outline-none
                ${currentView === item.id 
                  ? 'bg-[#ff8a00] text-[#18191b] shadow-lg' 
                  : 'text-[#fff2df]/60 hover:text-[#fff2df] hover:bg-white/5'}`}
            >
              <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </div>
              <span className={`font-black tracking-wider whitespace-nowrap ml-4 transition-[opacity,translate] ${labelMotion}`}>
                {item.label}
              </span>
            </button>
          )
        )}
      </div>

      {/* 2. SECCIÓN INFERIOR: Usuario y Logout[cite: 11] */}
      <div className="px-3 border-t border-white/10 pt-4 mt-2 shrink-0">
         
         {/* Botón Cerrar Turno */}
         <button 
            onClick={logout}
            className="flex items-center p-3 w-full text-[#f3701e] hover:bg-[#f3701e]/10 rounded-[1.25rem] transition-colors group overflow-hidden mb-4 outline-none"
          >
            <div className="shrink-0 group-hover:-translate-x-1 transition-transform">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </div>
            <span className={`font-black tracking-wide whitespace-nowrap ml-4 transition-[opacity,translate] ${labelMotion}`}>
              Cerrar Turno
            </span>
         </button>

         {/* Tarjeta de Usuario Activo */}
         <div className={`w-full flex items-center p-2 bg-black/40 rounded-[1.25rem] overflow-hidden border border-white/5`}>
            <div className="shrink-0 w-10 h-10 bg-[#373A3E] text-[#ff8a00] font-black text-xl rounded-xl flex items-center justify-center">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className={`ml-3 whitespace-nowrap flex flex-col items-start transition-[opacity,translate] ${labelMotion}`}>
              <span className="text-sm font-bold truncate max-w-[140px] text-[#fff2df]">
                {user?.name || 'Usuario'}
              </span>
              <span className="text-xs text-[#ff8a00] font-bold uppercase tracking-wider">
                {user?.rol || 'Staff'}
              </span>
            </div>
         </div>

      </div>
    </aside>
  );
};

export default Sidebar;