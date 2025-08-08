import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { updateResource } from './CRUD';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
  maxHeight: '70vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function CarrerasList() {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCarreraModal, setOpenCarreraModal] = useState(false);
  const [carreraActual, setCarreraActual] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [editCarrera, setEditCarrera] = useState({
    id: '',
    institucion: '',
    nombre: '',
    duracion: '',
    modalidad: '',
    horario: '',
    fecha_inicio: '',
    matricula: '',
    mensualidad: '',
    incluye_texto: 0,
  });

  // Estado para modal de materias
  const [openMateriasModal, setOpenMateriasModal] = useState(false);
  const [materiasModal, setMateriasModal] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [carreraActualId, setCarreraActualId] = useState(null);

  // Fetch carreras
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

  // Modal carreras (editar o crear)
  const handleOpenCarreraModal = (carrera = null) => {
    setErrores({});
    setMensajeError("");
    if (carrera) {
      const fecha = carrera.fecha_inicio
      ? new Date(carrera.fecha_inicio).toISOString().split("T")[0]
      : "";

    setEditCarrera({
      ...carrera,
      fecha_inicio: fecha,
    });
    } else {
      setEditCarrera({
        id: '',
        institucion: '',
        nombre: '',
        duracion: '',
        modalidad: '',
        horario: '',
        estado: carrera.estado !== undefined ? carrera.estado : 1,
        fecha_inicio: '',     
        matricula: '',
        mensualidad: '',
        incluye_texto: 0,
      });
    }
    setOpenCarreraModal(true);
  };

  const handleCloseCarreraModal = () => setOpenCarreraModal(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? (checked ? 1 : 0) : value;
    setEditCarrera({ ...editCarrera, [name]: val });
  };

  const handleSave = async () => {
  setErrores({});
  setMensajeError("");

  const nuevosErrores = {};

  // institucion
  if (!editCarrera.institucion) {
    nuevosErrores.institucion = "La institución es obligatoria.";
  } else if (!['INFOPRO', 'CLADECORP'].includes(editCarrera.institucion)) {
    nuevosErrores.institucion = "Institución inválida.";
  }

  // nombre
  if (!editCarrera.nombre || !editCarrera.nombre.trim()) {
    nuevosErrores.nombre = "El nombre es obligatorio.";
  } else if (editCarrera.nombre.length > 150) {
    nuevosErrores.nombre = "El nombre no puede superar los 150 caracteres.";
  }

  // duracion (opcional)
  if (editCarrera.duracion && editCarrera.duracion.length > 50) {
    nuevosErrores.duracion = "Duración no puede superar 50 caracteres.";
  }

  // modalidad (opcional)
  if (editCarrera.modalidad && editCarrera.modalidad.length > 50) {
    nuevosErrores.modalidad = "Modalidad no puede superar 50 caracteres.";
  }

  // horario (opcional)
  if (editCarrera.horario && editCarrera.horario.length > 100) {
    nuevosErrores.horario = "Horario no puede superar 100 caracteres.";
  }

  // fecha_inicio
  if (!editCarrera.fecha_inicio) {
    nuevosErrores.fecha_inicio = "Fecha de inicio es obligatoria.";
  } else if (isNaN(new Date(editCarrera.fecha_inicio).getTime())) {
    nuevosErrores.fecha_inicio = "Fecha de inicio inválida.";
  }

  // matricula (opcional)
  if (editCarrera.matricula !== '' && editCarrera.matricula !== null) {
    const val = Number(editCarrera.matricula);
    if (isNaN(val) || val < 0) {
      nuevosErrores.matricula = "La matrícula debe ser un número positivo.";
    }
  }

  // promo_mensualidad (opcional)
  if (editCarrera.mensualidad !== '' && editCarrera.mensualidad !== null) {
    const val = Number(editCarrera.mensualidad);
    if (isNaN(val) || val < 0) {
      nuevosErrores.mensualidad = "Promo mensualidad debe ser un número positivo.";
    }
  }

  // incluye_texto (opcional)
  if (editCarrera.incluye_texto !== 0 && editCarrera.incluye_texto !== 1) {
    nuevosErrores.incluye_texto = "Incluye texto debe ser 0 o 1.";
  }

  if (Object.keys(nuevosErrores).length > 0) {
    setErrores(nuevosErrores);
    return;
  }

  const action = editCarrera.id ? 'update' : 'create';
  const url = action === 'create'
    ? 'http://localhost:8000/api/carreras'
    : `http://localhost:8000/api/carreras/${editCarrera.id}`;

  try {
    await updateResource(url, editCarrera, action);
    fetchCarreras();
    handleCloseCarreraModal();
  } catch (error) {
    console.error("Fallo al guardar carrera:", error);
    setMensajeError("Error al guardar la carrera. Intente nuevamente.");
  }
};
const handleDeleteCarrera = async (id) => {
  const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta carrera?\nEsto también eliminará todas las materias asociadas.");

  if (!confirmacion) return;
  
  try {
    const response = await fetch(`http://localhost:8000/api/carreras/${id}/eliminar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ estado: 0 }), 
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la carrera");
    }

    alert("Carrera y sus materias asociadas eliminadas con éxito.");
    window.location.reload(); // Recarga la página

  } catch (error) {
    console.error("Error eliminando carrera:", error);
    alert("Hubo un error al eliminar la carrera.");
  }
};

  // Nuevo: función para abrir modal de materias y cargar materias de la carrera
  const handleVerMateriasModal = async (carreraId) => {
    setLoadingMaterias(true);
    setOpenMateriasModal(true);
    setCarreraActualId(carreraId);
    const carrera = carreras.find(c => c.id === carreraId);
    setCarreraActual(carrera);
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/api/materias?carrera_id=${carreraId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setMateriasModal(data);
      setOpenMateriasModal(true);
    } catch (error) {
      console.error("Error al cargar materias:", error);
      setMateriasModal([]);
    } finally {
      setLoadingMaterias(false);
    }
  };

  const handleCloseMateriasModal = () => setOpenMateriasModal(false);

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Institución", accessor: "institucion" },
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Duración", accessor: "duracion" },
    { Header: "Modalidad", accessor: "modalidad" },
    { Header: "Horario", accessor: "horario" },
    {
      Header: "Acciones",
      Cell: ({ row }) => {
        return (
         <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Editar">
            <MDButton
              color="info"
              size="medium"
              onClick={() => handleOpenCarreraModal(row.original)}
            >
              <EditIcon sx={{ fontSize: 28 }} />
            </MDButton>
          </Tooltip>

          <Tooltip title="Ver Materias">
            <MDButton
              color="secondary"
              size="medium"
              onClick={() => handleVerMateriasModal(row.original.id)}
            >
              <MenuBookIcon sx={{ fontSize: 28 }} />
            </MDButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <MDButton
              color="error"
              size="medium"
              onClick={() => handleDeleteCarrera(row.original.id)}
            >
              <DeleteIcon sx={{ fontSize: 28 }} />
            </MDButton>
          </Tooltip>
        </Box>
        );
      },
    },
  ];

  if (loading) return <div>Cargando carreras...</div>;

  return (
    <div>
      <Box sx={{ display: 'flex', ml: 2 }}>
        <MDButton color="success" onClick={() => handleOpenCarreraModal()}>
          Agregar Carrera
        </MDButton>
      </Box>

      <DataTable
        table={{ columns, rows: carreras }}
        entriesPerPage={{ defaultValue: 10 }}
        canSearch
        showTotalEntries
        pagination={{ variant: "gradient", color: "info" }}
        isSorted
        noEndBorder={false}
      />

      {/* Modal para crear/editar carrera */}
      <Modal open={openCarreraModal} onClose={handleCloseCarreraModal}>
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
            error={!!errores.institucion}
            helperText={errores.institucion || ""}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            <option value="INFOPRO">INFOPRO</option>
            <option value="CLADECORP">CLADECORP</option>
          </TextField>

          <TextField label="Nombre" name="nombre" fullWidth value={editCarrera.nombre} onChange={handleChange} error={!!errores.nombre} helperText={errores.nombre || ""} />
          <TextField label="Duración" name="duracion" fullWidth value={editCarrera.duracion} onChange={handleChange} error={!!errores.duracion} helperText={errores.duracion || ""} />
          <TextField label="Modalidad" name="modalidad" fullWidth value={editCarrera.modalidad} onChange={handleChange} error={!!errores.modalidad} helperText={errores.modalidad || ""} />
          <TextField label="Horario" name="horario" fullWidth value={editCarrera.horario} onChange={handleChange} error={!!errores.horario} helperText={errores.horario || ""} />
          <TextField label="Fecha de Inicio" name="fecha_inicio" type="date" fullWidth value={editCarrera.fecha_inicio} onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!errores.fecha_inicio} helperText={errores.fecha_inicio || ""} />
          <TextField label="Matrícula" name="matricula" type="number" fullWidth value={editCarrera.matricula} onChange={handleChange} error={!!errores.matricula} helperText={errores.matricula || ""}/>
          <TextField label="Mensualidad" name="mensualidad" type="number" fullWidth value={editCarrera.mensualidad} onChange={handleChange} error={!!errores.mensualidad} helperText={errores.mensualidad || ""}/>
          <FormControlLabel
            control={
              <Checkbox
                name="incluye_texto"
                checked={!!editCarrera.incluye_texto}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Incluye material textual (libros, apuntes, etc.)"
          />
          {errores.incluye_texto && (
            <Typography variant="caption" color="error">
              {errores.incluye_texto}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <MDButton color="info" onClick={handleSave}>
              {editCarrera.id ? "Actualizar" : "Guardar"}
            </MDButton>
            <MDButton color="secondary" onClick={handleCloseCarreraModal}>Cerrar</MDButton>
          </Box>
        </Box>
      </Modal>

      {/* Modal para mostrar materias */}
      <Modal open={openMateriasModal} onClose={handleCloseMateriasModal}>
        <Box sx={style} >
          <Typography variant="h6" mb={2}>
            Materias de la Carrera {carreraActual ? carreraActual.nombre : ''}
          </Typography>

          {loadingMaterias ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : materiasModal.length > 0 ? (
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {materiasModal.length > 0 ? (
                <List>
                  {materiasModal.map((materia) => (
                    <ListItem
                      key={materia.id}
                      divider
                      sx={{ bgcolor: '#f9f9f9', mb: 1, borderRadius: 1 }}
                    >
                      <ListItemText
                        primary={`${materia.codigo} - ${materia.asignatura}`}
                        secondary={`Horas: ${materia.horas}, Semestre: ${materia.semestre}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No hay materias para esta carrera.</Typography>
              )}
            </Box>
          ) : (
            <Typography>No hay materias para esta carrera.</Typography>
          )}
          <MDButton color="secondary" onClick={handleCloseMateriasModal}>
          Cerrar
        </MDButton>
        </Box>
        
      </Modal>
    </div>
  );
}
