/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav  .

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
// import Dashboard from "layouts/dashboard";
/*import Tables from "layouts/tables";
import Notifications from "layouts/notifications";*/
// import Profile from "layouts/profile";
import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";
import StudentsList from "layouts/students";
import SubjectsList from "layouts/subjects";
import ReportsDashboard from "layouts/reports";
import GradesList from "layouts/grades";
import PaymentsList from "layouts/payments"
import Inicio from "layouts/inicio";
import Materias from "layouts/materias";


import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "examples",
    name: "Inicio",
    key: "inicio",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/inicio",
    component: <Inicio />,
  },
  {
    type: "collapse",
    name: "User Management",
    key: "user-management",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/user-management",
    component: <UserManagement />,
  },
  {
    type: "collapse",
    name: "Registro de Estudiantes",
    key: "students",
    icon: <Icon fontSize="small">school</Icon>,
    route: "/students",
    component: <StudentsList />,
  },
  {
    type: "collapse",
    name: "Carreras",
    key: "subjects",
    icon: <Icon fontSize="small">book</Icon>,
    route: "/subjects",
    component: <SubjectsList />,
  },
  {
    type: "collapse",
    name: "Materias",
    key: "materias",
    icon: <Icon fontSize="small">library_books</Icon>,
    route: "/materias",
    component: <Materias />,
  },
  {
    type: "collapse",
    name: "Notas",
    key: "grades",
    icon: <Icon fontSize="small">grading</Icon>,
    route: "/grades",
    component: <GradesList />,
  },
  {
    type: "collapse",
    name: "Pagos",
    key: "payments",
    icon: <Icon fontSize="small">payments</Icon>,
    route: "/payments",
    component: <PaymentsList />,
  },
  {
    type: "collapse",
    name: "Reportes",
    key: "reports",
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: "/reports",
    component: <ReportsDashboard />,
  },
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <Dashboard />,
  // },

  /*{
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },*/

  /*{
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },*/
  
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  {
    type: "examples",
    name: "Perfil de usuario",
    key: "user-profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/user-profile",
    component: <UserProfile />,
  },
  {
    type: "auth",
    name: "Login",
    key: "login",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },
  {
    type: "auth",
    name: "Register",
    key: "register",
    icon: <Icon fontSize="small">reigster</Icon>,
    route: "/auth/register",
    component: <Register />,
  },
  {
    type: "auth",
    name: "Forgot Password",
    key: "forgot-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "auth",
    name: "Reset Password",
    key: "reset-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/reset-password",
    component: <ResetPassword />,
  },
];

export default routes;
