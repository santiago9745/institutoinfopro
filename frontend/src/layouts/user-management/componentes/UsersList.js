import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { updateResource } from './CRUD/update';
import { jwtDecode } from "jwt-decode";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 500,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', name: '', email: '', password: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  

  const fetchUsers = () => {
  setLoading(true);
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.error("❌ No token found, please login");
    setLoading(false);
    return;
  }

  fetch("http://localhost:8000/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json", 
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("❌ Error en la petición");
      return res.json();
    })
    .then((data) => {
      setUsers(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      setLoading(false);
    });
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setEditUser({ id: user.id, name: user.name, email: user.email, rol: user.rol });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditUser({ id: '', name: '', email: '' });
  };
   const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };
    const handleSaveUser = async () => {
    try {
      const action = editUser.id ? 'update' : 'create';
      const url = action === 'create'
        ? 'http://localhost:8000/api/users'
        : `http://localhost:8000/api/users/${editUser.id}`;

      await updateResource(url, editUser, action);
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Fallo al guardar usuario:", error);
    }
  };
    const columns = [
            { Header: "ID", accessor: "id" },
            { Header: "Nombre", accessor: "name" },
            { Header: "Email", accessor: "email" },
            { Header: "Rol", accessor:"rol",
              Cell: ({ value }) => {
                const roles = {
                  1:"Director",
                  2:"Secretaria",
                  3:"Docente",
                  4:"Estudiante",
                };
                return roles[value] || "Desconocido";
              },
            },
            { Header: "Acciones",
                Cell:({ row }) =>(
                    <MDButton color="info" size="small" onClick={() => handleOpen(row.original)}>
                        Actualizar
                    </MDButton>
                ),
                width: "100px",
                align: "center",
            },
        ];

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div>
      <MDButton sx={{ ml: 2 }} color="success" onClick={() => { setEditUser({ id: '', name: '', email: '', rol: ''}); setOpen(true); }}>
        Añadir usuario
      </MDButton>

      <DataTable
        table={{ columns, rows:users }}
        entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20] }}
        canSearch={true}  // Importante: desactiva buscador interno
        showTotalEntries={true}
        pagination={{ variant: "gradient", color: "info" }}
        isSorted={true}
        noEndBorder={false}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={ style }
        >
          <Typography variant="h6" component="h2">
            {editUser.id ? "Actualizar Usuario" : "Agregar Usuario"}
          </Typography>

          <TextField 
            label="Nombre" 
            fullWidth name="name" 
            value={editUser.name} 
            onChange={handleChange} 
            />
          <TextField 
            label="Email" 
            fullWidth name="email" 
            value={editUser.email} 
            onChange={handleChange} 
          />
          <TextField
            label="Contraseña"
            fullWidth
            name="password"
            value={editUser.password}
            onChange={handleChange}
            type="password"
          />
          <TextField
            select
            label="Rol"
            name="rol"
            value={editUser.rol}
            onChange={handleChange}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            <option value="1">Director</option>
            <option value="2">Secretaria</option>
            <option value="3">Docente</option>
            <option value="4">Estudiante</option>
          </TextField>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <MDButton color="info" onClick={handleSaveUser}>
              {editUser.id ? "Actualizar" : "Guardar"}
            </MDButton>
            <MDButton color="secondary" onClick={handleClose}>
              Cerrar
            </MDButton>
          </Box>
        </Box>
      </Modal>


    </div>
  );
}
