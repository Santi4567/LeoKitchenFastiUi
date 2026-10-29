// src/services/tableService.ts
import { fetchWithAuth } from "../utils/fetchClient";
import { Area } from "../types/table";

const API_URL = import.meta.env.VITE_API_URL;

// --- FUNCIÓN AUXILIAR PARA LEER ERRORES DE C# ---
// Si la petición falla, lee el JSON del backend y extrae el "message"
const handleMutationResponse = async (res: Response): Promise<boolean> => {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // Lanza el error con el texto exacto que programaste en el backend
    throw new Error(data.message || "Ocurrió un error inesperado en el servidor");
  }
  return true;
};

export const tableService = {
  // --- LECTURA ---
  getAreasWithTables: async (): Promise<Area[]> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/Tables/areas`);
      if (!response.ok) throw new Error("Error al cargar las mesas");
      
      const result = await response.json();
      return result.data as Area[]; 
    } catch (error) {
      console.error("Error fetching tables:", error);
      return [];
    }
  },

  // --- CRUD ÁREAS ---
  createArea: async (name: string): Promise<boolean> => {
    const res = await fetchWithAuth(`${API_URL}/Tables/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Evita el error 415
      body: JSON.stringify({ name })
    });
    return handleMutationResponse(res);
  },

  updateArea: async (id: number, name: string): Promise<boolean> => {
    const res = await fetchWithAuth(`${API_URL}/Tables/areas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return handleMutationResponse(res);
  },

  deleteArea: async (id: number): Promise<boolean> => {
    const res = await fetchWithAuth(`${API_URL}/Tables/areas/${id}`, { 
      method: 'DELETE' 
    });
    return handleMutationResponse(res);
  },

  // --- CRUD MESAS ---
  createTable: async (name: string, areaId: number): Promise<boolean> => {
    const res = await fetchWithAuth(`${API_URL}/Tables/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, areaId })
    });
    return handleMutationResponse(res);
  },

  deleteTable: async (id: number): Promise<boolean> => {
    const res = await fetchWithAuth(`${API_URL}/Tables/tables/${id}`, { 
      method: 'DELETE' 
    });
    return handleMutationResponse(res);
  },

  // --- ACCIÓN OPERATIVA ---
  openTable: async (tableId: number, covers: number): Promise<boolean> => {
    const res = await fetchWithAuth(`${API_URL}/Tables/${tableId}/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ covers })
    });
    return handleMutationResponse(res);
  }
};