// Mapeo exacto del enum TableStatus del backend de C#
// 0 = Libre
// 1 = Ocupada
export interface Table {
  id: number;
  name: string;
  status: number;
  areaId: number;
}

// Mapeo del modelo Area.cs con su lista de mesas incluidas
export interface Area {
  id: number;
  name: string;
  tables: Table[];
}