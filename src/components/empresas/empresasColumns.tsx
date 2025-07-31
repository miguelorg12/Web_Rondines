type EmpresaRow = {
  numEmpresa: string;
  nombre: string;
  direccion: string;
};

export const empresasColumns = [
  {
    name: "Num empresa",
    selector: (row: EmpresaRow) => row.numEmpresa,
    sortable: true,
    width: "120px",
  },
  {
    name: "Nombre",
    selector: (row: EmpresaRow) => row.nombre,
    sortable: true,
    width: "180px",
  },
  {
    name: "Dirección",
    selector: (row: EmpresaRow) => row.direccion,
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
