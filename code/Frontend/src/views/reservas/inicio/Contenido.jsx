import "../../../styles/reservas/Principal/contenido.css";
import TablaReservas from "./TablaReservas";
import CardReserva from "./CardReserva";
import { useState, useEffect } from "react";
import { peticionForm } from "../../../utils/peticiones";
import Vacio from "./Vacio";

function Contenido() {
  const [allResState, setAllResState] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRes = await peticionForm(
          "https://www.sire.software/admin/get_reservas",
          "GET"
        );

        setAllResState(allRes);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cnt-contenido">
      <div className="search-cnt">
        {allResState.length === 0 ||
        allResState.message === "No hay reservas para visualizar" ? (
          <Vacio />
        ) : (
          <CardReserva allResState={allResState} />
        )}
      </div>
      <div className="cnt-reservas">
        {allResState.length === 0 ||
        allResState.message === "No hay reservas para visualizar" ? (
          <Vacio />
        ) : (
          <TablaReservas allResState={allResState} />
        )}
      </div>
    </div>
  );
}

export default Contenido;
