import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { updateResource } from './CRUD';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  width: 600,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function CarrerasList() {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editCarrera, setEditCarrera] = useState({
    id: '',
    institucion: '',
    nombre: '',
    duracion: '',
    modalidad: '',
    horario: '',
    fecha_inicio: '',
    promo_matricula: '',
    promo_mensualidad: '',
    incluye_texto: 0,
  });

  const fetchCarreras = () => {
    setLoading(true);
    const token = sessionStorage.getItem("access_token");

    fetch("http://localhost:8000/api/carreras", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta de la API carreras:", data); 
        setCarreras(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar carreras:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  const handleOpen = (carrera = null) => {
    if (carrera) {
      setEditCarrera(carrera);
    } else {
      setEditCarrera({
        id: '',
        institucion: '',
        nombre: '',
        duracion: '',
        modalidad: '',
        horario: '',
        fecha_inicio: '',
        promo_matricula: '',
        promo_mensualidad: '',
        incluye_texto: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? (checked ? 1 : 0) : value;
    setEditCarrera({ ...editCarrera, [name]: val });
  };

  const handleSave = async () => {
    const action = editCarrera.id ? 'update' : 'create';
    const url = action === 'create'
      ? 'http://localhost:8000/api/carreras'
      : `http://localhost:8000/api/carreras/${editCarrera.id}`;

    try {
      await updateResource(url, editCarrera, action);
      fetchCarreras();
      handleClose();
    } catch (error) {
      console.error("Fallo al guardar carrera:", error);
    }
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Institución", accessor: "institucion" },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Duración", accessor: "duracion" },
    { Header: "Modalidad", accessor: "modalidad" },
    { Header: "Horario", accessor: "horario" },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <MDButton color="info" size="small" onClick={() => handleOpen(row.original)}>
          Editar
        </MDButton>
      ),
    },
  ];

  if (loading) return <div>Cargando carreras...</div>;

  return (
    <div>
      <MDButton color="success" onClick={() => handleOpen()}>Agregar Carrera</MDButton>

      <DataTable
        table={{ columns, rows: carreras }}
        entriesPerPage={{ defaultValue: 10 }}
        canSearch
        showTotalEntries
        pagination={{ variant: "gradient", color: "info" }}
        isSorted
        noEndBorder={false}
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">
            {editCarrera.id ? "Actualizar Carrera" : "Agregar Carrera"}
          </Typography>

          <TextField
            select
            label="Institución"
            name="institucion"
            value={editCarrera.institucion}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="INFOPRO">INFOPRO</MenuItem>
            <MenuItem value="CLADECORP">CLADECORP</MenuItem>
          </TextField>

          <TextField label="Nombre" name="nombre" fullWidth value={editCarrera.nombre} onChange={handleChange} />
          <TextField label="Duración" name="duracion" fullWidth value={editCarrera.duracion} onChange={handleChange} />
          <TextField label="Modalidad" name="modalidad" fullWidth value={editCarrera.modalidad} onChange={handleChange} />
          <TextField label="Horario" name="horario" fullWidth value={editCarrera.horario} onChange={handleChange} />
          <TextField label="Fecha de Inicio" name="fecha_inicio" type="date" fullWidth value={editCarrera.fecha_inicio} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="Promo Matrícula" name="promo_matricula" type="number" fullWidth value={editCarrera.promo_matricula} onChange={handleChange} />
          <TextField label="Promo Mensualidad" name="promo_mensualidad" type="number" fullWidth value={editCarrera.promo_mensualidad} onChange={handleChange} />
          <TextField label="Incluye Texto (1 o 0)" name="incluye_texto" type="number" fullWidth value={editCarrera.incluye_texto} onChange={handleChange} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <MDButton color="info" onClick={handleSave}>
              {editCarrera.id ? "Actualizar" : "Guardar"}
            </MDButton>
            <MDButton color="secondary" onClick={handleClose}>Cerrar</MDButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
