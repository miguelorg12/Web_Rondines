type SucursalRow = {
  numSucursal: string;
  nombre: string;
  direccion: string;
  empresa: string;
};

export const sucursalesColumns = [
  {
    name: "Num sucursal",
    selector: (row: SucursalRow) => row.numSucursal,
    sortable: true,
    width: "120px",
  },
  {
    name: "Empresa",
    selector: (row: SucursalRow) => row.empresa,
    sortable: true,
    width: "180px",
  },
  {
    name: "Nombre",
    selector: (row: SucursalRow) => row.nombre,
    sortable: true,
    width: "180px",
  },
  {
    name: "Dirección",
    selector: (row: SucursalRow) => row.direccion,
    sortable: true,
    width: "220px",
  },

  {
    name: "Acciones",
    cell: () => (
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="action-btn edit-btn" title="Editar">
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button className="action-btn delete-btn" title="Eliminar">
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    ),
    ignoreRowClick: true,
    width: "120px",
  },
];
