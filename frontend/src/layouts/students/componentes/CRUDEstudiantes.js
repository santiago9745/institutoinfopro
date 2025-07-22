import React, { useEffect, useState } from 'react';
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  width: 600,
  maxHeight: '90vh', // máximo 90% de la altura de la ventana
  overflowY: 'auto', // agrega scroll si se pasa
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function EstudiantesInscritos() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const steps = ['Datos del Estudiante', 'Datos de Inscripción', 'Datos de Pago'];
  const [step, setStep] = useState(1);
  const completed = {
  0: step > 1, // paso 1 completado si step es > 1
  1: step > 2, // paso 2 completado si step es > 2
  2: false,    // paso 3 (actual), aún no está completado
};
  const [editEstudiante, setEditEstudiante] = useState({
   id: '', // id de inscripción (si edita)
    usuario_id: '', // se usa si edita

    // Datos del usuario (nuevo)
    name: '',
    apellido_paterno: '',
    apellido_materno: '',
    ci: '',
    expedido: '',
    celular: '',
    email: '',
    password: '',

    // Datos de inscripción
    carrera_id: '',
    fecha_inscripcion: '',
    estado: 'activo',

    monto_pago: '',
    concepto_pago: '',
    fecha_pago: '',
  });

  useEffect(() => {
  fetchEstudiantes();

  // Obtener usuarios y carreras
  fetch(`${process.env.REACT_APP_API_URL}usuarios`)
    .then(res => res.json())
    .then(setUsuarios);

  fetch(`${process.env.REACT_APP_API_URL}carreras`)
    .then(res => res.json())
    .then(setCarreras);
}, []);

  // Carga estudiantes con sus relaciones usuario y carrera
  const fetchEstudiantes = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}estudiantes-inscritos`)
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
    { Header: "Nombre", accessor: "usuario.name"},
    { Header: "Apellido Paterno", accessor: "usuario.apellido_paterno" },
    { Header: "Apellido Materno", accessor: "usuario.apellido_materno" }, 
    { Header: "CI", accessor: "usuario.ci" },
    { Header: "Expedido", accessor: "usuario.expedido" },
    { Header: "Celular", accessor: "usuario.celular" },
    { Header: "Email", accessor: "usuario.email" },

    { Header: "Carrera", accessor: "carrera.nombre" },
    { Header: "Instituto", accessor: "carrera.instituto" },
    { Header: "Modalidad", accessor: "carrera.modalidad" },
    { Header: "Horario", accessor: "carrera.horario" },

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
          <Stepper activeStep={step - 1} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* ---------------------- PÁGINA 1: DATOS DEL ESTUDIANTE ---------------------- */}
          {step === 1 && (
            <>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Datos del Estudiante
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Nombre" fullWidth name="name" value={editEstudiante.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Apellido Paterno" fullWidth name="apellido_paterno" value={editEstudiante.apellido_paterno} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Apellido Materno" fullWidth name="apellido_materno" value={editEstudiante.apellido_materno} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="CI" fullWidth name="ci" value={editEstudiante.ci} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Expedido" fullWidth name="expedido" value={editEstudiante.expedido} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Celular" fullWidth name="celular" value={editEstudiante.celular} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email" fullWidth name="email" value={editEstudiante.email} onChange={handleChange} />
                </Grid>
              </Grid>
            </>
          )}

          {/* ---------------------- PÁGINA 2: DATOS DE INSCRIPCIÓN ---------------------- */}
          {step === 2 && (
            <>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Datos de Inscripción
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Carrera"
                    fullWidth
                    name="carrera_id"
                    value={editEstudiante.carrera_id}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    {carreras.map((carrera) => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.nombre}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="Fecha Inscripción"
                    fullWidth
                    name="fecha_inscripcion"
                    value={editEstudiante.fecha_inscripcion}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Estado"
                    fullWidth
                    name="estado"
                    value={editEstudiante.estado}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    <option value="activo">Activo</option>
                    <option value="retirado">Retirado</option>
                    <option value="reprobado">Reprobado</option>
                    <option value="finalizado">Finalizado</option>
                  </TextField>
                </Grid>
              </Grid>
            </>
          )}

          {/* ---------------------- PÁGINA 3: DATOS DE PAGO ---------------------- */}
          {step === 3 && (
            <>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Datos de Pago
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Monto"
                    type="number"
                    fullWidth
                    name="monto_pago"
                    value={editEstudiante.monto_pago || ''}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Concepto"
                    fullWidth
                    name="concepto_pago"
                    value={editEstudiante.concepto_pago || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha de Pago"
                    type="date"
                    fullWidth
                    name="fecha_pago"
                    value={editEstudiante.fecha_pago || ''}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* ---------------------- NAVEGACIÓN ENTRE PASOS ---------------------- */}
<Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
  {/* Botón cancelar a la izquierda */}
  <MDButton color="secondary" onClick={handleClose}>
    Cancelar
  </MDButton>

  {/* Grupo de botones: Atrás + Siguiente */}
  <Box display="flex" sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: 1 }}>
    {step > 1 && (
      <MDButton
        color="info"
        onClick={() => setStep(step - 1)}
        sx={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        Atrás
      </MDButton>
    )}
    {step < 3 ? (
      <MDButton
        color="info"
        onClick={() => setStep(step + 1)}
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeft: '1px solid rgba(255,255,255,0.3)', // línea divisoria
        }}
      >
        Siguiente
      </MDButton>
    ) : (
      <MDButton
        color="success"
        onClick={handleSaveEstudiante}
        sx={{
          borderTopLeftRadius: step > 1 ? 0 : '8px',
          borderBottomLeftRadius: step > 1 ? 0 : '8px',
          borderLeft: '1px solid rgba(255,255,255,0.3)', // línea divisoria
        }}
      >
        Guardar
      </MDButton>
    )}
  </Box>
</Box>


        </Box>
      </Modal>

    </div>
  );
}
