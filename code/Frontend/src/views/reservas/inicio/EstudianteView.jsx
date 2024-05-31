import "../../../styles/reservas/Principal/estudiante.css";
import React, { useEffect, useState } from "react";
import { peticionForm } from "../../../utils/peticiones";
import { BiCalendarCheck, BiCheckCircle, BiSolidInbox } from "react-icons/bi";
import CardPropia from "./CardPropia";
import { message } from "antd";
import { BiBadgeCheck, BiBuildings, BiTime } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import Vacio from "./Vacio";

function Historial({ reserva }) {
  const fechaInicio = new Date(reserva.Fh_Fin);
  const fecha = fechaInicio.toLocaleDateString();

  return (
    <div className="card-propia-historial">
      <div className="head-propia">
        <h6>{fecha}</h6>
      </div>
      <div className="content-propia-historial">
        <div className="icon-text-historial">
          <div>
            <BiBuildings /> {reserva.ID_Espacio}
          </div>
          <div>
            <LuUsers /> {reserva.ID_Prof_Mat}
          </div>
          <div>
            <BiBadgeCheck />
            {reserva.Estado}
          </div>
        </div>
      </div>
    </div>
  );
}

function EstudianteView() {
  const [reservas, setReservas] = useState([]);
  const [reservasActivas, setReservasActivas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reserva = await peticionForm(
          "https://sire-utb-x2ifq.ondigitalocean.app/form/getAll",
          "GET"
        );

        const reservasActivas = reserva.filter(
          (reserva) => reserva.Estado == "Pendiente"
        );

        const historialReservas = reserva.filter(
          (reserva) =>
            reserva.Estado === "Finalizada" ||
            reserva.Estado === "Cancelada" ||
            reserva.Estado === "Rechazada" ||
            reserva.Estado === "Aprobada"
        );

        setReservasActivas(reservasActivas);
        setReservas(historialReservas);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const cancelarReserva = async (reservaId) => {
    try {
      const response = await peticionForm(
        `https://sire-utb-x2ifq.ondigitalocean.app/form/cancel_reser/${reservaId}`,
        "PATCH"
      );
      message.success("La reserva ha sido cancelada exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return response;
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      message.error("Error al cancelar la reserva");
    }
  };

  return (
    <div className="cnt-estudiante">
      <div className="header-estudiantes">
        <div className="cnt-ms-reservas">
          <div className="title-reservas-profesores">
            <BiCalendarCheck />
            <h5>Mis reservas</h5>
          </div>
          {reservasActivas.length > 0 ? (
            <div className="propia-reserva">
              {reservasActivas.map((reserva, index) => (
                <CardPropia
                  key={index}
                  reserva={reserva}
                  cancelarReserva={cancelarReserva}
                />
              ))}
            </div>
          ) : (
            <Vacio />
          )}
        </div>
        <div className="cnt-historial-reservas">
          <div className="title-historial-profesores">
            <BiCheckCircle />
            <h5>Historial de reservas</h5>
          </div>
          {reservas.length > 0 ? (
            <div className="historial-reservas">
              {reservas.map((reserva, index) => (
                <Historial key={index} reserva={reserva} />
              ))}
            </div>
          ) : (
            <Vacio />
          )}
        </div>
      </div>
    </div>
  );
}

export default EstudianteView;
