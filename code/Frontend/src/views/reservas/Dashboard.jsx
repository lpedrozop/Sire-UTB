import React, { useState, useEffect } from "react";
import MenuLateral from "./MenuLateral";
import HeaderContenido from "./HeaderContenido";
import Contenido from "../reservas/inicio/Contenido";
import CntCalendario from "../reservas/calendario/CntCalendario";
import CntAsignar from "../reservas/asignar/CntAsignar";
import ProfesorView from "./inicio/ProfesorView";
import EstudianteView from "../reservas/inicio/EstudianteView";
import AuxiliarView from "./inicio/AuxiliarView";
import { useLoader } from "../../utils/Loader";
import { fetchTokenInfo } from "../../utils/fetchTokenInfo";
import { decodeToken } from "../../utils/decodedToken";
import "../../styles/reservas/dashboard.css";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [contenido, setContenido] = useState("inicio");
  const { loading, showLoader, hideLoader } = useLoader();
  const [role, setRole] = useState("");

  const manejoEstadoContenido = (itemEstado) => {
    setContenido(itemEstado);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const data = await fetchTokenInfo();
        const tokenResult = decodeToken(data.secretParse.secret);
        const userRole = tokenResult.payload.roles[0];
        localStorage.setItem("role", userRole);
        setRole(userRole);
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, []);

  const renderContenido = () => {
    switch (contenido) {
      case "inicio":
        return <Contenido />;
      case "calendario":
        return <CntCalendario />;
      case "asignar":
        return <CntAsignar />;
      default:
        return <Contenido />;
    }
  };

  return (
    <div className="cnt-panel">
      <MenuLateral onItemClick={manejoEstadoContenido} role={role} />
      <div className="cnt-dashboard">
        <HeaderContenido
          userData={userData}
          loading={loading}
          role={role}
          onItemClick={manejoEstadoContenido}
        />
        {role === "Profesor" && <ProfesorView />}
        {role === "Aux_Administrativo" && <AuxiliarView />}
        {role === "Estudiante" && <EstudianteView />}
        {role === "Administrador" && renderContenido()}
      </div>
    </div>
  );
}

export default Dashboard;
