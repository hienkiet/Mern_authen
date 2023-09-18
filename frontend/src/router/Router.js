import React from "react";
import jwt_decode from "jwt-decode";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
const NotFound = React.lazy(() => import("../components/404/404"));
const HomePage = React.lazy(() => import("../pages/HomePage"));
const ContactPage = React.lazy(() => import("../pages/ContactPage"));
const LoginPage = React.lazy(() => import("../pages/Login/LoginPage"));
const CartPage = React.lazy(() => import("../pages/Cart/CartPage"));
const RegisterPage = React.lazy(() => import("../pages/Register/Register"));
const UserProfile = React.lazy(() =>
  import("../pages/UserProfile/UserProfile")
);
const Upload = React.lazy(() => import("../pages/Upload/Upload"));
const UserControl = React.lazy(() =>
  import("../components/AdminControl/UserControl/UserControl")
);
const AdminDashboard = React.lazy(() =>
  import("../components/AdminDashboard/AdminDashboard")
);
const HomeControl = React.lazy(() =>
  import("../components/AdminControl/HomeControl")
);

const publicRoutes = [
  { path: "/", component: HomePage },
  // Auth
  { path: "/login", component: LoginPage, layout: null },
  { path: "/register", component: RegisterPage, layout: null },
  { path: "/logout", component: HomePage },
  { path: "/forget-password", component: ForgetPassword, layout: null },

  // // User
  { path: "/me/cart", component: CartPage },
  // { path: "/me/profile", component: UserProfile },
  // { path: "/me/profile", component: UserProfile },

  // Contact
  { path: "/contact", component: ContactPage },

  // 404
  { path: "*", component: NotFound },
];

const privateRoutes = () => {
  const token = localStorage.getItem("ptvactk");
  if (!token) return [];
  try {
    const decoded = jwt_decode(token);
    var isAdmin = decoded?.isAdmin || false;
  } catch (error) {
    return [];
  }

  const loginRoute = [
    // User
    { path: "/me/profile", component: UserProfile },
    { path: "/me/profile", component: UserProfile },
    { path: "/upload", component: Upload },
  ];

  // Admin
  const adminRoutes = [
    {
      path: "/admin/dashboard",
      component: HomeControl,
      layout: AdminDashboard,
    },
    {
      path: "/admin/control/users",
      component: UserControl,
      layout: AdminDashboard,
    },
  ];
  if (!isAdmin) return loginRoute;
  return [...loginRoute, ...adminRoutes];
};

export { publicRoutes, privateRoutes };
