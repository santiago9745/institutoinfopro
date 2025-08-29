import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context"; // Ajusta la ruta según tu proyecto

/**
 * ProtectedRoute: Componente para proteger rutas según autenticación y roles.
 * 
 * Props:
 * - allowedRoles: Array de roles permitidos para esta ruta. Ej: ['admin', 'docente']
 * - redirectPath: Ruta a la que se redirige si el usuario no está autenticado
 * - children: Componentes hijos que se renderizarán si pasa la validación
 */
const ProtectedRoute = ({
  allowedRoles = [],
  redirectPath = "/auth/login",
  children,
}) => {
  // Obtener estado de autenticación y usuario desde AuthContext
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // Mostrar mensaje de carga mientras el contexto se inicializa
  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Validación de roles si se pasan roles permitidos
  if (allowedRoles.length > 0) {
    const role = user?.rol;

    // Si todavía no se cargó el rol, mostrar mensaje de carga
    if (!role) {
      return <div>Cargando datos de usuario...</div>;
    }

    // Si el rol del usuario no está permitido, redirigir a inicio
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/inicio" replace />;
    }
  }

  // Todo ok, renderizar los hijos
  return children;
};

export default ProtectedRoute;
