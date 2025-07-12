import React from "react";
import { Link } from "react-router-dom";

// MUI Components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";

// Imagen de bienvenida (colócala en assets/images/inforpro.jpg o pedímela)
import bannerImage from "assets/images/baner-infopro.png";

const Inicio = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={6}>
        <Grid container spacing={3}>
          {/* Banner Institucional */}
          <Grid item xs={12}>
            <Card>
              <MDBox component="img" src={bannerImage} alt="Inforpro" width="65%" borderRadius="lg" />
            </Card>
          </Grid>

          {/* Bienvenida */}
          <Grid item xs={12}>
            <Card>
              <MDBox px={3} py={3}>
                <MDTypography variant="h4" fontWeight="medium" gutterBottom>
                  ¡Bienvenido al Sistema de Gestión Académica - Inforpro!
                </MDTypography>
                <MDTypography variant="body1" color="text">
                  Este sistema ha sido diseñado para facilitar la administración de estudiantes, materias,
                  calificaciones, pagos y más. Explora el menú para comenzar a trabajar.
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          {/* Módulos o próximos anuncios */}
          
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Inicio;
