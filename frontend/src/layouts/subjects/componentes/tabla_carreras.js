import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const style = {
  position: 'absolute',
  top: '50%', left: '50%',
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
    id: '', institucion: '', nombre: '', duracion: '', modalidad: '',
    horario: '', fecha_inicio: '', promo_matricula: '', promo_mensualidad: '',
    incluye_texto: false
  });

  const fetchCarreras = () => {
    setLoading(true);
    const token = sessionStorage.getItem("access_token");
    fetch("http://localhost:8000/api/carreras", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(res => { if (!res.ok) throw new Error("❌ Error al obtener carreras"); return res.json(); })
      .then(data => { setCarreras(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchCarreras(); }, []);

  const handleOpen = carrera => {
    setEditCarrera({ ...carrera });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCarrera({
      id: '', institucion: '', nombre: '', duracion: '', modalidad: '',
      horario: '', fecha_inicio: '', promo_matricula: '', promo_mensualidad: '',
      incluye_texto: false
    });
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setEditCarrera({ ...editCarrera, [name]: type === 'checkbox' ? checked : value });
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Institución", accessor: "institucion" },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Duración", accessor: "duracion" },
    { Header: "Modalidad", accessor: "modalidad" },
    { Header: "Horario", accessor: "horario" },
    { Header: "Fecha de Inicio", accessor: "fecha_inicio" },
    { Header: "Promo Matrícula", accessor: "promo_matricula" },
    { Header: "Promo Mensualidad", accessor: "promo_mensualidad" },
    {
      Header: "Incluye Texto",
      accessor: "incluye_texto",
      Cell: ({ value }) => value ? 'Sí' : 'No'
    },
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

  if (loading) return <div>Cargando carreras...</div>;

  return (
    <div>
      <MDButton sx={{ ml: 2 }} color="success" onClick={() => { setEditCarrera({
        id: '', institucion: '', nombre: '', duracion: '', modalidad: '',
        horario: '', fecha_inicio: '', promo_matricula: '', promo_mensualidad: '',
        incluye_texto: false
      }); setOpen(true); }}>
        Añadir Carrera
      </MDButton>

      <DataTable
        table={{ columns, rows: carreras }}
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
            {editCarrera.id ? "Actualizar Carrera" : "Agregar Carrera"}
          </Typography>

          <TextField
            select label="Institución" name="institucion"
            value={editCarrera.institucion} onChange={handleChange} fullWidth SelectProps={{ native: true }}>
            <option value=""></option>
            <option value="INFOPRO">INFOPRO</option>
            <option value="CLADECORP">CLADECORP</option>
          </TextField>

          <TextField label="Nombre" name="nombre" fullWidth value={editCarrera.nombre} onChange={handleChange} />
          <TextField label="Duración" name="duracion" fullWidth value={editCarrera.duracion} onChange={handleChange} />

          <TextField
            select label="Modalidad" name="modalidad" fullWidth
            value={editCarrera.modalidad} onChange={handleChange} SelectProps={{ native: true }}
          >
            <option value=""></option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </TextField>

          <TextField label="Horario" name="horario" fullWidth value={editCarrera.horario} onChange={handleChange} />
          <TextField
            type="date" name="fecha_inicio" fullWidth
            label="Fecha de Inicio" InputLabelProps={{ shrink: true }}
            value={editCarrera.fecha_inicio} onChange={handleChange}
          />
          <TextField type="number" label="Promo Matrícula" name="promo_matricula" fullWidth value={editCarrera.promo_matricula} onChange={handleChange} />
          <TextField type="number" label="Promo Mensualidad" name="promo_mensualidad" fullWidth value={editCarrera.promo_mensualidad} onChange={handleChange} />

          <FormControlLabel
            control={<Checkbox checked={editCarrera.incluye_texto} onChange={handleChange} name="incluye_texto" />}
            label="Incluye textos"
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <MDButton color="info" onClick={() => alert("Guardar aún no implementado")}>
              {editCarrera.id ? "Actualizar" : "Guardar"}
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
