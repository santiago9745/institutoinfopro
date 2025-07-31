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
  width: 800,
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
  const [carreras, setCarreras] = useState([]);
  const steps = ['Datos del Estudiante', 'Datos de Inscripción', 'Datos de Pago'];
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
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


  const validateStep = () => {
  const newErrors = {};

  if (step === 1) {
    if (!editEstudiante.name || editEstudiante.name.trim() === "")
      newErrors.name = "El nombre es obligatorio";
    if (!editEstudiante.apellido_paterno || editEstudiante.apellido_paterno.trim() === "")
      newErrors.apellido_paterno = "El apellido paterno es obligatorio";
    if (
      editEstudiante.apellido_materno &&
      editEstudiante.apellido_materno.length > 255
    )
      newErrors.apellido_materno = "Máximo 255 caracteres";
    if (!editEstudiante.ci || editEstudiante.ci.trim() === "")
      newErrors.ci = "El CI es obligatorio";
    if (!editEstudiante.expedido || editEstudiante.expedido.trim() === "")
      newErrors.expedido = "Debe seleccionar un departamento de expedición";
    if (!editEstudiante.celular || editEstudiante.celular.trim() === "")
      newErrors.celular = "El celular es obligatorio";
    if (!editEstudiante.email || editEstudiante.email.trim() === "")
      newErrors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEstudiante.email))
      newErrors.email = "Email inválido";
    if (!editEstudiante.password || editEstudiante.password.trim().length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  if (step === 2) {
    if (!editEstudiante.carrera_id)
      newErrors.carrera_id = "Debe seleccionar una carrera";
    if (!editEstudiante.fecha_inscripcion)
      newErrors.fecha_inscripcion = "Debe ingresar la fecha de inscripción";
    if (
      editEstudiante.estado &&
      !["activo", "inactivo"].includes(editEstudiante.estado)
    )
      newErrors.estado = "Estado inválido";
  }

  if (step === 3) {
    const hayMonto = editEstudiante.monto_pago !== undefined && editEstudiante.monto_pago !== null && editEstudiante.monto_pago !== "";

    if (hayMonto) {
      if (isNaN(editEstudiante.monto_pago) || Number(editEstudiante.monto_pago) < 0)
        newErrors.monto_pago = "El monto debe ser un número válido";
      if (!editEstudiante.concepto_pago || editEstudiante.concepto_pago.trim() === "")
        newErrors.concepto_pago = "Debe ingresar un concepto de pago";
      if (!editEstudiante.fecha_pago)
        newErrors.fecha_pago = "Debe ingresar una fecha de pago";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // Carga estudiantes con sus relaciones usuario y carrera
  const fetchEstudiantes = () => {
  setLoading(true);
  const token = sessionStorage.getItem("access_token");

  fetch("http://localhost:8000/api/v2/estudiantes-inscritos", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setEstudiantes(data); // Asegúrate de tener este estado definido
      setLoading(false);
    })
    .catch(err => {
      console.error("Error al cargar estudiantes:", err);
      setLoading(false);
    });
};


  useEffect(() => {
    fetchEstudiantes();
  }, []);
  
  const fetchCarreras = () => {
  setLoading(true); // Opcional: para mostrar un spinner de carga
  const token = sessionStorage.getItem("access_token");

  fetch("http://localhost:8000/api/carreras", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      setCarreras(data); // Aquí guardas solo las carreras
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error al cargar carreras:", err);
      setLoading(false);
    });
};
useEffect(() => {
  fetchCarreras();
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
    setErrors({});
    setStep(1);
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
  try {
    const token = sessionStorage.getItem("access_token"); 
    const response = await fetch(`http://localhost:8000/api/inscripciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`,},
      body: JSON.stringify(editEstudiante),
    });

    if (!response.ok) throw new Error("Error al registrar al estudiante");

    fetchEstudiantes();
    handleClose();
  } catch (error) {
    console.error("Fallo al guardar estudiante:", error);
  }
};

  const columns = [
    { Header: "ID", accessor: "id" }, 
    { Header: "Nombre", accessor: "name"},
    { Header: "Apellido Paterno", accessor: "apellido_paterno" },
    { Header: "Apellido Materno", accessor: "apellido_materno" }, 
    { Header: "CI", accessor: "ci" },
    { Header: "Expedido", accessor: "expedido" },
    { Header: "Celular", accessor: "celular" },
    { Header: "Email", accessor: "email" },

    { Header: "Carrera", accessor: "carrera_nombre" },
    { Header: "Instituto", accessor: "institucion" },
    { Header: "Modalidad", accessor: "modalidad" },
    { Header: "Horario", accessor: "horario" },

    { Header: "Fecha Inscripción", accessor: "fecha_inscripcion" },
    { Header: "Estado", accessor: "estado_inscripcion" },
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
                  <TextField label="Nombre" fullWidth name="name" value={editEstudiante.name} onChange={handleChange} error={Boolean(errors.name)} helperText={errors.name} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Apellido Paterno" fullWidth name="apellido_paterno" value={editEstudiante.apellido_paterno} onChange={handleChange} error={Boolean(errors.apellido_paterno)} helperText={errors.apellido_paterno} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Apellido Materno" fullWidth name="apellido_materno" value={editEstudiante.apellido_materno} onChange={handleChange} error={Boolean(errors.apellido_materno)} helperText={errors.apellido_materno} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="CI" fullWidth name="ci" value={editEstudiante.ci} onChange={handleChange} error={Boolean(errors.ci)} helperText={errors.ci} />
                </Grid>
                <Grid item xs={6}>
                  <TextField select label="Expedido" fullWidth name="expedido" value={editEstudiante.expedido} onChange={handleChange} SelectProps={{ native: true }} error={Boolean(errors.expedido)} helperText={errors.expedido}>
                    <option value=""> </option>
                    <option value="CB">Cochabamba</option>
                    <option value="LP">La Paz</option>
                    <option value="SC">Santa Cruz</option>
                    <option value="TJ">Tarija</option>
                    <option value="OR">Oruro</option>
                    <option value="PT">Potosí</option>
                    <option value="CH">Chuquisaca</option>
                    <option value="BE">Beni</option>
                    <option value="PD">Pando</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Celular" fullWidth name="celular" value={editEstudiante.celular} onChange={handleChange} error={Boolean(errors.celular)} helperText={errors.celular} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email" fullWidth name="email" value={editEstudiante.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} />
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
                    error={Boolean(errors.carrera_id)}
                    helperText={errors.carrera_id}
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
                    error={Boolean(errors.fecha_inscripcion)}
                    helperText={errors.fecha_inscripcion}
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
                    error={Boolean(errors.estado)}
                    helperText={errors.estado}
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
                    error={Boolean(errors.monto_pago)}
                    helperText={errors.monto_pago}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Concepto"
                    fullWidth
                    name="concepto_pago"
                    value={editEstudiante.concepto_pago || ''}
                    onChange={handleChange}
                    error={Boolean(errors.concepto_pago)}
                    helperText={errors.concepto_pago}
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
                    error={Boolean(errors.fecha_pago)}
                    helperText={errors.fecha_pago}
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
                  onClick={() => {
                    if (validateStep()) setStep(step + 1);
                  }}
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
                  onClick={() => {
                    if (validateStep()) handleSaveEstudiante();
                  }}
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
