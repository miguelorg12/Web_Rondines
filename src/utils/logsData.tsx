import type { Log } from "../interfaces";

export const logsData: Log[] = [
  {
    id: 1,
    logNumber: "L001",
    name: "Juan Pérez",
    branch: "Centro",
    role: "Admin",
    actionType: "Inicio de sesión",
    dateTime: "2025-07-23 09:15",
  },
  {
    id: 2,
    logNumber: "L002",
    name: "Ana López",
    branch: "Norte",
    role: "Usuario",
    actionType: "Cierre de sesión",
    dateTime: "2025-07-23 10:05",
  },
  {
    id: 3,
    logNumber: "L003",
    name: "Carlos Ruiz",
    branch: "Sur",
    role: "Supervisor",
    actionType: "Actualización de datos",
    dateTime: "2025-07-23 11:30",
  },
];
