import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

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
                <strong>Instituto Tecnológico INFOPRO</strong> y del{" "}
                <strong>Centro de Capacitación CLADECORP</strong>, ofreciendo una plataforma integral para
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
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={imageList[currentIndex]}
                alt={`Banner ${currentIndex}`}
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  transition: "opacity 0.5s ease-in-out",
                  display: "block",
                }}
              />
              {/* Dots pequeños sobre la imagen */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                {imageList.map((_, index) => (
                  <IconButton
                    key={index}
                    onClick={() => handleDotClick(index)}
                    sx={{
                      color: index === currentIndex ? "white" : "grey.400",
                      backgroundColor: index === currentIndex ? "primary.main" : "rgba(0,0,0,0.3)",
                      mx: 0.4,
                      p: 0.3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
};

export default Inicio;
