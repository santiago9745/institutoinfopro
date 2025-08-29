import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import Footer from 'examples/Footer';

const Notas = () => {
  return (
    <DashboardLayout>
        <DashboardNavbar/>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                borderRadius="lg"
                                coloredShadow="info"
                                sx={{
                                    background: "linear-gradient(45deg, #e60000, #ff3300)",
                                    color: "white", // para que el texto se vea bien
                                }}
                            >
                                <MDTypography variant="h6" color="white">
                                    Listado de notas 
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        <Footer />
    </DashboardLayout>
  );
};

export default Notas;