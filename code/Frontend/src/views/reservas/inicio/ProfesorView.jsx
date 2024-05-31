import React, { useEffect, useState } from "react";
import { BiCalendarCheck, BiCheckCircle, BiSolidInbox } from "react-icons/bi";
import { peticionForm } from "../../../utils/peticiones";
import "../../../styles/reservas/Principal/profesor.css";
import CardPropia from "./CardPropia";
import Historial from "./Historial";
import { message } from "antd";
import Vacio from './Vacio'

const ReservaCard = ({ reserva, aprobarReserva, rechazarReserva }) => {
  return (
    <div className="reserva-card-profesor">
      <div className="head-card-reserva">
        <p>{reserva.Materia}</p>
      </div>
      <div className="foot-card-reserva">
        <h6>{reserva.Estudiante}</h6>
        <p>{reserva.Aula}</p>
      </div>
      <div className="buttons-actions">
        <button
          className="button-action aprobar"
          onClick={() => aprobarReserva(reserva.ID_Reserva)}
        >
          Aprobar
        </button>
        <button
          className="button-action rechazar"
          onClick={() => rechazarReserva(reserva.ID_Reserva)}
        >
          Rechazar
        </button>
      </div>
    </div>
  );
};

function ProfesorView() {
  const [aprobarReservas, setAprobarReservas] = useState([]);
  const [misReservas, setMisReservas] = useState([]);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await peticionForm(
          "https://coral-app-up4fv.ondigitalocean.app/profe/reserva_profe",
          "GET"
        );

        const reserva = await peticionForm(
          "https://sire-utb-x2ifq.ondigitalocean.app/form/getAll",
          "GET"
        );

        const historial = await peticionForm(
          "https://coral-app-up4fv.ondigitalocean.app/profe/historial",
          "GET"
        );

        const reservaActiva = reserva.filter(
          (reserva) => reserva.Estado === "Pendiente"
        );

        setAprobarReservas(data);
        setMisReservas(reservaActiva);
        setHistorial(historial);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const aprobarReserva = async (reservaId) => {
    try {
      const body = { Estado: "Aprobada" };
      const response = await peticionForm(
        `https://coral-app-up4fv.ondigitalocean.app/profe/estado_reserva/${reservaId}`,
        "PATCH",
        body
      );
      message.success("La reserva ha sido aprobada exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return response;
    } catch (error) {
      console.error("Error al aprobar la reserva:", error);
      message.error("Error al aprobar la reserva");
    }
  };

  const rechazarReserva = async (reservaId) => {
    try {
      const body = { Estado: "Rechazada" };
      const response = await peticionForm(
        `https://coral-app-up4fv.ondigitalocean.app/profe/estado_reserva/${reservaId}`,
        "PATCH",
        body
      );
      message.success("La reserva ha sido rechazada exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return response;
    } catch (error) {
      console.error("Error al rechazar la reserva:", error);
      message.error("Error al rechazar la reserva");
    }
  };

  const cancelarReserva = async (reservaId) => {
    try {
      const response = await peticionForm(
        `https://sire-utb-x2ifq.ondigitalocean.app/form/cancel_reser/${reservaId}`,
        "PATCH"
      );
      message.success("La reserva ha sido cancelada exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return response;
    } catch (error) {
      console.error("Error al rechazar la reserva:", error);
      message.error("Error al rechazar la reserva");
    }
  };

  return (
    <div className="cnt-profesor">
      <div className="header-profesor">
        <div className="cnt-ms-reservas">
          <div className="title-reservas-profesores">
            <BiCalendarCheck />
            <h5>Mis reservas</h5>
          </div>
          {misReservas.length > 0 ? (
            <div className="propia-reserva">
              {misReservas.map((reserva, index) => (
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
          {historial.length > 0 ? (
            <div className="historial-reservas">
              {historial.map((reserva, index) => (
                <Historial key={index} reserva={reserva} />
              ))}
            </div>
          ) : (
            <Vacio />
          )}
        </div>
      </div>
      <div className="footer-profesor">
        <div className="title-historial-profesores">
          <BiCheckCircle />
          <h5>Reservas por aprobar</h5>
        </div>
        {aprobarReservas.length > 0 ? (
          <div className="reserva-cards">
            {aprobarReservas.map((reserva, index) => (
              <ReservaCard
                key={index}
                reserva={reserva}
                aprobarReserva={aprobarReserva}
                rechazarReserva={rechazarReserva}
              />
            ))}
          </div>
        ) : (
          <Vacio />
        )}
      </div>
    </div>
  );
}

export default ProfesorView;
