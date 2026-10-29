// src/hooks/useTableSignalR.ts
import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '../context/AuthContext';

// Reemplaza /api por /restaurantHub
const HUB_URL = import.meta.env.VITE_API_URL.replace('/api', '/restaurantHub');

export const useTableSignalR = (onTableStatusChanged: (tableId: number, status: number) => void) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        setIsConnected(true);
        // Unirse al grupo de meseros definido en tu backend
        connection.invoke("UnirseAMeseros");

        // Escuchar el evento que emitirá tu backend cuando una mesa se abra
        connection.on("TableStatusChanged", (tableId: number, status: number) => {
          onTableStatusChanged(tableId, status);
        });
      })
      .catch(err => console.error("Error SignalR Tables:", err));

    return () => {
      connection.stop();
    };
  }, [user?.token, onTableStatusChanged]);

  return { isConnected };
};