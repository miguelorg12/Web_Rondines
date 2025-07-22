import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type UsuarioRow = {
  numUsuario: string;
  nombre: string;
  sucursal: string;
  rol: string;
  curp: string;
};

export const usuariosColumns = [
  {
    name: "Num. Usuario",
    selector: (row: UsuarioRow) => row.numUsuario,
    sortable: true,
    width: "120px",
  },
  {
    name: "Nombre",
    selector: (row: UsuarioRow) => row.nombre,
    sortable: true,
    width: "180px",
  },
  {
    name: "Sucursal",
    selector: (row: UsuarioRow) => row.sucursal,
    sortable: true,
    width: "140px",
  },
  {
    name: "Rol",
    selector: (row: UsuarioRow) => row.rol,
    sortable: true,
    width: "120px",
  },
  {
    name: "CURP",
    selector: (row: UsuarioRow) => row.curp,
    sortable: true,
    width: "180px",
  },
  {
    name: "Acciones",
    cell: () => (
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="action-btn edit-btn" title="Editar">
          <EditIcon />
        </button>
        <button className="action-btn delete-btn" title="Eliminar">
          <DeleteIcon />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    width: "120px",
  },
];
