// src/utils/authStore.ts

// NOTA: Cambia 'window.api' por el nombre real que hayas exportado en tu preload.ts
// (puede ser window.electron, window.ipcRenderer, etc.)

export const saveSecureToken = async (token: string) => {
  // 1. Intentamos usar la API segura de Electron
  if (typeof window !== 'undefined' && window.api && window.api.save) {
    await window.api.save('refreshToken', token);
  } else {
    // 2. Fallback para cuando pruebas en Google Chrome / Edge con Vite
    console.warn("Modo Navegador: Usando localStorage para guardar el token.");
    localStorage.setItem('refreshToken', token);
  }
};

export const getSecureToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined' && window.api && window.api.get) {
    return await window.api.get('refreshToken');
  }
  return localStorage.getItem('refreshToken');
};

export const deleteSecureToken = async () => {
  if (typeof window !== 'undefined' && window.api && window.api.delete) {
    await window.api.delete('refreshToken');
  } else {
    localStorage.removeItem('refreshToken');
  }
};