type ReporteRow = {
  numReporte: string;
  guardia: string;
  sucursal: string;
  incidencia: string;
  fecha: string;
};

export const reportesColumns = [
  {
    name: "Num reporte",
    selector: (row: ReporteRow) => row.numReporte,
    sortable: true,
    width: "120px",
  },
  {
    name: "Guardia",
    selector: (row: ReporteRow) => row.guardia,
    sortable: true,
    width: "180px",
  },
  {
    name: "Sucursal",
    selector: (row: ReporteRow) => row.sucursal,
    sortable: true,
    width: "140px",
  },
  {
    name: "Incidencia",
    selector: (row: ReporteRow) => row.incidencia,
    sortable: true,
    width: "180px",
  },
  {
    name: "Fecha",
    selector: (row: ReporteRow) => row.fecha,
    sortable: true,
    width: "120px",
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
