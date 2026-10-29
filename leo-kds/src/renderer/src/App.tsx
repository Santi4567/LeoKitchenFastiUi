// src/App.tsx
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import { ToastProvider } from "./context/ToastContext"; // <-- ESTA ES LA LÍNEA CLAVE

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#373A3E] flex items-center justify-center font-sans">
        <span className="text-[#ff8a00] font-black text-2xl animate-pulse tracking-widest uppercase">
          Iniciando Sistema...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <MainLayout />;
};

function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;