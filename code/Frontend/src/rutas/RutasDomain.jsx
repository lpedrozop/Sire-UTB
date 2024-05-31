import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "../views/landing/Landing";
import Formulario from "../views/formulario/Formulario";
import Dashboard from "../views/reservas/Dashboard";
import { LoaderProvider } from "../utils/Loader";
import { isAuth } from "../auth/authConfig";

const RutaPrivada = ({ element: Element, ...rest }) => {
  return isAuth() ? <Element {...rest} /> : <Navigate to="/" />;
};

export const routes = [
  { path: "/", element: Landing },
  { path: "/dashboard", element: Dashboard, private: true },
  { path: "/form", element: Formulario, private: true },
];

export function RutasDomain() {
  return (
    <Router>
      <LoaderProvider>
        <Routes>
          {routes.map((route, index) =>
            route.private ? (
              <Route
                key={index}
                path={route.path}
                element={<RutaPrivada element={route.element} />}
              />
            ) : (
              <Route
                key={index}
                path={route.path}
                element={<route.element />}
              />
            )
          )}
        </Routes>
      </LoaderProvider>
    </Router>
  );
}
