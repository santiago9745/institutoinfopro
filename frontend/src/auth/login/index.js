import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import AuthService from "services/auth-service";
import { AuthContext } from "context";
import CircularProgress from "@mui/material/CircularProgress";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { jwtDecode } from "jwt-decode";

function Login() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentialsErros, setCredentialsError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [inputs, setInputs] = useState({
    email: "admin@jsonapi.com",
    password: "secret",
  });

  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
  });

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      setLoading(false);
      return;
    }

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      setLoading(false);
      return;
    }

    const newUser = { email: inputs.email, password: inputs.password };

    const myData = { email: inputs.email, password: inputs.password };

      try {
    const response = await AuthService.login(myData);
    const user = response.user;

    sessionStorage.setItem("access_token", response.access_token);
    sessionStorage.setItem("refresh_token", response.refresh_token);
    sessionStorage.setItem("user", JSON.stringify(user));
    
    authContext.login(response.access_token, response.refresh_token, user);

    navigate("/inicio");
    } catch (err) {
      // Suponiendo que la respuesta de error viene con estructura conocida
    if (err.response && err.response.data) {
      // Por ejemplo, si el backend envía mensaje en err.response.data.message
      setCredentialsError(err.response.data.message || "Error desconocido");
    } else if (err.message) {
      // Si es un error general de JS
      setCredentialsError(err.message);
    } else {
      setCredentialsError("Error desconocido al iniciar sesión.");
    }
    } finally {
      setLoading(false);
    }
  };

  const primaryRed = "#D32F2F";

  return (
    <CoverLayout coverHeight="45vh" image={bgImage}>
      <Card sx={{ border: `3px solid ${primaryRed}`, padding: 2 }}>
        <MDTypography variant="h4" fontWeight="medium" color="text" mt={2}>
          Iniciar sesión
        </MDTypography>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={4}>
              <MDInput
                type="email"
                label="Correo electrónico"
                fullWidth
                value={inputs.email}
                name="email"
                onChange={changeHandler}
                error={errors.emailError}
              />
            </MDBox>
            <MDBox mb={1}>
              <MDInput
                type="password"
                label="Contraseña"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} sx={{ color: primaryRed }} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Recordarme
              </MDTypography>
            </MDBox>

            <MDBox mt={1} mb={1}>
              <MDButton
                variant="gradient"
                sx={{
                  backgroundColor: primaryRed,
                  color: "#fff",
                  "&:hover": { backgroundColor: "#b71c1c" },
                }}
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
              </MDButton>
            </MDBox>

            {credentialsErros && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {credentialsErros}
              </MDTypography>
            )}

            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿Olvidaste tu contraseña? Recuperar{" "}
                <MDTypography
                  component={Link}
                  to="/auth/forgot-password"
                  variant="button"
                  sx={{ color: primaryRed, fontWeight: "medium" }}
                  textGradient
                >
                  aquí
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Login;
