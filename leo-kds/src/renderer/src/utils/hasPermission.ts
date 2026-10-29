// src/utils/hasPermission.ts
import { UserData, PermisoKey } from '../types/auth';

export const hasPermission = (user: any, requiredPermission: string): boolean => {
      if (!user) return false;

  // 1. Superusuario Admin tiene acceso irrestricto
  if (user.rol?.toLowerCase() === 'admin') return true;

  if (!user.permisos) return false;

  // 2. Extraer módulo desde el permiso (ej: 'open.tables' -> modulo 'TABLES')
  const parts = requiredPermission.split('.');
  const moduleKey = parts.length > 1 ? parts[1].toUpperCase() : '';

  // Búsqueda directa en la categoría si existe
  if (moduleKey && user.permisos[moduleKey]) {
    return user.permisos[moduleKey].includes(requiredPermission);
  }

  // 3. Fallback: recorrer todos los arreglos por si el nombre del módulo difiere
  return Object.values(user.permisos).some(
    (permisosList) => Array.isArray(permisosList) && permisosList.includes(requiredPermission)
  );
};