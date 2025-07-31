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
  const [carreras, setCarreras] = useState([]);
  const [editMateria, setEditMateria] = useState({ id: '', codigo: '', asignatura: '', semestre: '', horas: '', carreras: ''});
  const [errores, setErrores] = useState({});
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
  const fetchCarreras = () => {
    const token = sessionStorage.getItem("access_token");

    fetch("http://localhost:8000/api/carreras", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener carreras");
        return res.json();
      })
      .then((data) => {
        setCarreras(data);
      })
      .catch((err) => {
        console.error("❌ Error al cargar carreras:", err);
      });
  };

  useEffect(() => {
    fetchMaterias();
    fetchCarreras();
  }, []);

  const handleOpen = (materia) => {
    setSelectedMateria(materia);
    setEditMateria({
      id: materia.id,
      codigo: materia.codigo,
      asignatura: materia.asignatura,
      semestre: materia.semestre,
      horas: materia.horas,
      carrera_id: materia.carrera_id || '',
    });
    setErrores({});
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
    if (!validarMateria()) return;

    try {
      const action = editMateria.id ? 'update' : 'create';
      const url = action === 'create'
        ? 'http://localhost:8000/api/v2/materias'
        : `http://localhost:8000/api/v2/materias/${editMateria.id}`;

      await updateResource(url, editMateria, action);
      fetchMaterias();
      handleClose();
    } catch (error) {
      console.error("Fallo al guardar materia:", error);
    }
  };


  const validarMateria = () => {
    const nuevosErrores = {};
    const codigoTrim = editMateria.codigo.trim();
    const asignaturaTrim = editMateria.asignatura.trim();

    if (!codigoTrim) {
      nuevosErrores.codigo = "El código es obligatorio.";
    } else if (codigoTrim.length > 20) {
      nuevosErrores.codigo = "El código no debe superar los 20 caracteres.";
    } else if (
      materias.some(
        (m) =>
          m.codigo.toLowerCase() === codigoTrim.toLowerCase() &&
          m.id !== editMateria.id
      )
    ) {
      nuevosErrores.codigo = "Este código ya está registrado.";
    }

    if (!asignaturaTrim) {
      nuevosErrores.asignatura = "La asignatura es obligatoria.";
    } else if (asignaturaTrim.length > 150) {
      nuevosErrores.asignatura = "La asignatura no debe superar los 150 caracteres.";
    } else if (
      materias.some(
        (m) =>
          m.asignatura.toLowerCase() === asignaturaTrim.toLowerCase() &&
          m.id !== editMateria.id
      )
    ) {
      nuevosErrores.asignatura = "Esta asignatura ya está registrada.";
    }

    if (!editMateria.semestre) {
      nuevosErrores.semestre = "El semestre es obligatorio.";
    } else if (!Number.isInteger(Number(editMateria.semestre)) || editMateria.semestre < 1) {
      nuevosErrores.semestre = "Debe ser un número entero positivo.";
    }

    if (!editMateria.horas) {
      nuevosErrores.horas = "Las horas son obligatorias.";
    } else if (Number(editMateria.horas) <= 0) {
      nuevosErrores.horas = "Debe ser un número mayor a cero.";
    }

    if (!editMateria.carrera_id) {
      nuevosErrores.carrera_id = "La carrera es obligatoria.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
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
            error={!!errores.codigo}
            helperText={errores.codigo}
          />
          <TextField
            label="Asignatura"
            fullWidth
            name="asignatura"
            value={editMateria.asignatura}
            onChange={handleChange}
            error={!!errores.asignatura}
            helperText={errores.asignatura}
          />
          <TextField
            label="Semestre"
            fullWidth
            name="semestre"
            value={editMateria.semestre}
            onChange={handleChange}
            error={!!errores.semestre}
            helperText={errores.semestre}
          />
          <TextField
            label="Horas"
            fullWidth
            name="horas"
            value={editMateria.horas}
            onChange={handleChange}
            type="number" // Asegura que el input sea numérico
            error={!!errores.horas}
            helperText={errores.horas}
          />
          <TextField
            select
            label="Carrera"
            fullWidth
            name="carrera_id"
            value={editMateria.carrera_id}
            onChange={handleChange}
            error={!!errores.carrera_id}
            helperText={errores.carrera_id}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {carreras.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </TextField>
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