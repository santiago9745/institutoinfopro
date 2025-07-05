import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { updateResource } from './CRUD/update';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  width: 600,      // ancho del modal
  height: 400,
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', name: '', email: '' });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setEditUser({ id: user.id, name: user.name, email: user.email });
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
      <MDButton sx={{ ml: 2 }} color="success" onClick={() => { setEditUser({ id: '', name: '', email: '' }); setOpen(true); }}>
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
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2" mb={2}>
            {editUser.id ? "Actualizar Usuario" : "Agregar Usuario"}
          </Typography>

          {/* Aquí puedes poner inputs para añadir o editar usuario */}
            <Box sx={{ display:'flex', gap: 2 }}>
                <TextField
                    label="Nombre"
                    fullWidth
                    margin="normal"
                    name="name"
                    value={editUser.name}
                    onChange={handleChange}
                    size="medium"
                />
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={editUser.email}
                    onChange={handleChange}
                    size="medium"
                />
                <TextField
                  label="Contraseña"
                  fullWidth
                  margin="normal"
                  name="password"
                  value={editUser.password}
                  onChange={handleChange}
                  type="password"
                />
            </Box>
            <MDButton color="info" sx={{ mt: 2, mr: 2 }} onClick={handleSaveUser}>
              {editUser.id ? "Actualizar" : "Guardar"}
            </MDButton>
          <MDButton color="info" onClick={handleClose} sx={{ mt: 2 }}>
            Cerrar
          </MDButton>
        </Box>
      </Modal>
    </div>
  );
}
