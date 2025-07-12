import React from "react";
import { Link } from "react-router-dom";

// MUI Components
import Grid from "@mui/material/Grid";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";

// Imagen de bienvenida
import bannerImage from "assets/images/baner-infopro.png";

const Inicio = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={4} pb={6}>
        <Grid container spacing={3}>

          {/* Título y subtítulo */}
          <Grid item xs={12}>
            <MDBox textAlign="center" px={2} py={1}>
              <MDTypography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                ¡Bienvenido al Sistema de Gestión Académica de Infopro!
              </MDTypography>
              <MDTypography variant="h5" color="text" fontWeight="regular">
                La tecnología y la educación se unen para brindarte una mejor experiencia.
              </MDTypography>
            </MDBox>
          </Grid>

          {/* Texto explicativo extendido */}
          <Grid item xs={12}>
            <MDBox px={4} py={1}>
              <MDTypography variant="body1" color="text" lineHeight={1.8}>
                Este sistema fue desarrollado para facilitar y optimizar la administración académica del Instituto Tecnológico Infopro.
                Permite registrar y gestionar estudiantes, docentes, materias, calificaciones y pagos de manera eficiente.
                Su diseño intuitivo permite que tanto personal administrativo como docentes puedan trabajar con facilidad.
              </MDTypography>

              <MDBox mt={2}>
                <MDTypography variant="body1" color="text" lineHeight={1.8}>
                  Explora el menú lateral para acceder a los diferentes módulos y comenzar a gestionar la información del instituto.
                  Este sistema ha sido construido pensando en las necesidades reales del entorno educativo técnico-tecnológico.
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>

          {/* Imagen institucional */}
          <Grid item xs={12}>
            <MDBox
              component="img"
              src={bannerImage}
              alt="Inforpro"
              sx={{
                width: "100%",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "16px",
                display: "block",
                objectFit: "cover",
              }}
            />
          </Grid>

        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
};

export default Inicio;
