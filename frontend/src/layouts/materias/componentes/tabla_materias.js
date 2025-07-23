import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { updateResource } from './CRUD'; // Asegúrate de que esta ruta sea correcta

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

export default function MateriasList() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMateria, setEditMateria] = useState({ id: '', codigo: '', asignatura: '', semestre: '', horas: '' });
  const [selectedMateria, setSelectedMateria] = useState(null);

  const fetchMaterias = () => {
    setLoading(true);
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      console.error("❌ No se encontró el token, por favor inicia sesión.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/v2/materias", { // Cambia la URL a tu endpoint de materias
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("❌ Error en la petición para obtener materias");
        return res.json();
      })
      .then((data) => {
        setMaterias(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al cargar materias:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  const handleOpen = (materia) => {
    setSelectedMateria(materia);
    setEditMateria({
      id: materia.id,
      codigo: materia.codigo,
      asignatura: materia.asignatura,
      semestre: materia.semestre,
      horas: materia.horas,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMateria({ id: '', codigo: '', asignatura: '', semestre: '', horas: '' });
  };

  const handleChange = (e) => {
    setEditMateria({ ...editMateria, [e.target.name]: e.target.value });
  };

  const handleSaveMateria = async () => {
    try {
      const action = editMateria.id ? 'update' : 'create';
      const url = action === 'create'
        ? 'http://localhost:8000/api/v2/materias' // Endpoint para crear materia
        : `http://localhost:8000/api/v2/materias/${editMateria.id}`; // Endpoint para actualizar materia

      await updateResource(url, editMateria, action);
      fetchMaterias(); // Recarga la lista de materias después de guardar
      handleClose();
    } catch (error) {
      console.error("Fallo al guardar materia:", error);
    }
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Código", accessor: "codigo" },
    { Header: "Asignatura", accessor: "asignatura" },
    { Header: "Semestre", accessor: "semestre" },
    { Header: "Horas", accessor: "horas" },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <MDButton color="info" size="small" onClick={() => handleOpen(row.original)}>
          Actualizar
        </MDButton>
      ),
      width: "100px",
      align: "center",
    },
  ];

  if (loading) return <div>Cargando materias...</div>;

  return (
    <div>
      <MDButton sx={{ ml: 2 }} color="success" onClick={() => { setEditMateria({ id: '', codigo: '', asignatura: '', semestre: '', horas: '' }); setOpen(true); }}>
        Añadir Materia
      </MDButton>

      <DataTable
        table={{ columns, rows: materias }}
        entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20] }}
        canSearch={true}
        showTotalEntries={true}
        pagination={{ variant: "gradient", color: "info" }}
        isSorted={true}
        noEndBorder={false}
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {editMateria.id ? "Actualizar Materia" : "Agregar Materia"}
          </Typography>

          <TextField
            label="Código"
            fullWidth
            name="codigo"
            value={editMateria.codigo}
            onChange={handleChange}
          />
          <TextField
            label="Asignatura"
            fullWidth
            name="asignatura"
            value={editMateria.asignatura}
            onChange={handleChange}
          />
          <TextField
            label="Semestre"
            fullWidth
            name="semestre"
            value={editMateria.semestre}
            onChange={handleChange}
          />
          <TextField
            label="Horas"
            fullWidth
            name="horas"
            value={editMateria.horas}
            onChange={handleChange}
            type="number" // Asegura que el input sea numérico
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <MDButton color="info" onClick={handleSaveMateria}>
              {editMateria.id ? "Actualizar" : "Guardar"}
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