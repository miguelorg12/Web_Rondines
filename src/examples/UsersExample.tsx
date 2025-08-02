// Ejemplo de cómo usar el usersApi en un componente
import { useGetUsersQuery, useCreateUserMutation } from '../redux/users/usersApi';
import { CreateUser } from '../interfaces';

export function UsersList() {
  // Hook para obtener usuarios
  const { 
    data: users, 
    error, 
    isLoading, 
    refetch 
  } = useGetUsersQuery();

  // Hook para crear usuario
  const [createUser, { 
    isLoading: isCreating, 
    error: createError 
  }] = useCreateUserMutation();

  const handleCreateUser = async () => {
    const newUser: CreateUser = {
      name: "Test User",
      last_name: "Test LastName",
      curp: "TEST123456HDFLNR01",
      email: "test@example.com",
      password: "password123",
      biometric: "fingerprint_data",
      role_id: 1,
      branch_id: 1
    };

    try {
      await createUser(newUser).unwrap();
      console.log('Usuario creado exitosamente');
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error al cargar usuarios</div>;

  return (
    <div>
      <h2>Usuarios ({users?.length})</h2>
      <button onClick={handleCreateUser} disabled={isCreating}>
        {isCreating ? 'Creando...' : 'Crear Usuario'}
      </button>
      
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            {user.name} {user.last_name} - {user.role.name} 
            {user.active ? ' (Activo)' : ' (Inactivo)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
