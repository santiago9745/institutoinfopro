import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Layout y componentes personalizados
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";

// Imágenes institucionales
import infoproImage from "assets/images/baner-infopro.png";
import cladecorpImage from "assets/images/baner-cladecorp.png";

const imageList = [infoproImage, cladecorpImage];

const Inicio = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={4} pb={6}>
        <Grid container spacing={3}>
          {/* Título */}
          <Grid item xs={12}>
            <MDBox textAlign="center" px={2} py={1}>
              <MDTypography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                ¡Bienvenido al Sistema Académico de INFOPRO y CLADECORP!
              </MDTypography>
              <MDTypography variant="h5" color="text" fontWeight="regular">
                La tecnología y la educación se unen para brindarte una mejor experiencia.
              </MDTypography>
            </MDBox>
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <MDBox px={4} py={1}>
              <MDTypography variant="body1" color="text" lineHeight={1.8}>
                Este sistema unifica la gestión académica del{" "}
                <span style={{ fontWeight: "bold" }}>Instituto Tecnológico INFOPRO</span> y del{" "}
                <span style={{ fontWeight: "bold" }}>Centro de Capacitación CLADECORP</span>, ofreciendo una plataforma integral para
                registrar estudiantes, administrar materias, controlar calificaciones, gestionar pagos y generar reportes.
              </MDTypography>

              <MDBox mt={2}>
                <MDTypography variant="body1" color="text" lineHeight={1.8}>
                  Utiliza el menú lateral o los accesos rápidos para comenzar a explorar las funcionalidades disponibles para ambas instituciones.
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>

          {/* Carrusel de imágenes */}
          <Grid item xs={12}>
            <Box
              component="img"
              src={imageList[currentIndex]}
              alt={`Banner ${currentIndex}`}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "16px",
                objectFit: "cover",
                transition: "opacity 0.5s ease-in-out",
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
