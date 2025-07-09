import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  width: 600,
  height: 400,
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function EstudiantesInscritos() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editEstudiante, setEditEstudiante] = useState({
    id: '',
    usuario_id: '',
    carrera_id: '',
    fecha_inscripcion: '',
    estado: ''
  });

  // Carga estudiantes con sus relaciones usuario y carrera
  const fetchEstudiantes = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/estudiantes-inscritos`)
      .then(res => res.json())
      .then(data => {
        setEstudiantes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const handleOpen = (estudiante) => {
    if(estudiante) {
      setEditEstudiante({
        id: estudiante.id,
        usuario_id: estudiante.usuario_id,
        carrera_id: estudiante.carrera_id,
        fecha_inscripcion: estudiante.fecha_inscripcion,
        estado: estudiante.estado
      });
    } else {
      setEditEstudiante({
        id: '',
        usuario_id: '',
        carrera_id: '',
        fecha_inscripcion: '',
        estado: ''
      });
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditEstudiante({
      id: '',
      usuario_id: '',
      carrera_id: '',
      fecha_inscripcion: '',
      estado: ''
    });
  };

  const handleChange = (e) => {
    setEditEstudiante({ ...editEstudiante, [e.target.name]: e.target.value });
  };

  const handleSaveEstudiante = async () => {
    // Aquí debes implementar la función para crear o actualizar inscripción, ejemplo con fetch o axios
    // Similar a tu updateResource, ajusta URL y método POST o PUT según sea creación o actualización
    // Después de guardar, recarga la lista con fetchEstudiantes() y cierra modal con handleClose()
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    { 
      Header: "Nombre Completo", 
      accessor: row => `${row.usuario?.name || ''} ${row.usuario?.apellido_paterno || ''} ${row.usuario?.apellido_materno || ''}`
    },
    { Header: "Email", accessor: "usuario.email" },
    { Header: "Carrera", accessor: "carrera.nombre" },
    { Header: "Fecha Inscripción", accessor: "fecha_inscripcion" },
    { Header: "Estado", accessor: "estado" },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <MDButton color="info" size="small" onClick={() => handleOpen(row.original)}>
          Editar
        </MDButton>
      ),
      width: "100px",
      align: "center",
    },
  ];

  if (loading) return <div>Cargando estudiantes...</div>;

  return (
    <div>
      <MDButton sx={{ ml: 2, mb: 2 }} color="success" onClick={() => handleOpen(null)}>
        Añadir Inscripción
      </MDButton>

      <DataTable
        table={{ columns, rows: estudiantes }}
        entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20] }}
        canSearch={true}
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
            {editEstudiante.id ? "Editar Inscripción" : "Nueva Inscripción"}
          </Typography>

          {/* Aquí pon inputs para usuario, carrera, fecha y estado */}
          {/* Si tienes listas de usuarios y carreras, lo ideal es un select */}
          <TextField
            label="ID Usuario"
            fullWidth
            margin="normal"
            name="usuario_id"
            value={editEstudiante.usuario_id}
            onChange={handleChange}
          />
          <TextField
            label="ID Carrera"
            fullWidth
            margin="normal"
            name="carrera_id"
            value={editEstudiante.carrera_id}
            onChange={handleChange}
          />
          <TextField
            label="Fecha Inscripción"
            type="date"
            fullWidth
            margin="normal"
            name="fecha_inscripcion"
            value={editEstudiante.fecha_inscripcion}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Estado"
            fullWidth
            margin="normal"
            name="estado"
            value={editEstudiante.estado}
            onChange={handleChange}
          />

          <MDButton color="info" sx={{ mt: 2, mr: 2 }} onClick={handleSaveEstudiante}>
            {editEstudiante.id ? "Actualizar" : "Guardar"}
          </MDButton>
          <MDButton color="info" onClick={handleClose} sx={{ mt: 2 }}>
            Cerrar
          </MDButton>
        </Box>
      </Modal>
    </div>
  );
}
