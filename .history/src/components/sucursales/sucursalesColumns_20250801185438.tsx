import type { Branch } from '../../interfaces';

export const sucursalesColumns = [
  {
    name: "ID",
    selector: (row: Branch) => row.id,
    sortable: true,
    width: "80px",
  },
  {
    name: "Empresa",
    selector: (row: Branch) => row.company?.name || 'N/A',
    sortable: true,
    width: "180px",
  },
  {
    name: "Manager",
    selector: (row: Branch) => {
      if (!row.user) return 'N/A';
      return `${row.user.name} ${row.user.last_name}`;
    },
    sortable: true,
    width: "180px",
  },
  {
    name: "Nombre",
    selector: (row: Branch) => row.name,
    sortable: true,
    width: "180px",
  },
  {
    name: "Dirección",
    selector: (row: Branch) => row.address,
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
