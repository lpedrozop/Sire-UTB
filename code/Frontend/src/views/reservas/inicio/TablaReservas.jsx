import React, { useState } from "react";
import { message } from "antd";
import "../../../styles/reservas/Principal/contenido.css";
import { peticionForm } from "../../../utils/peticiones";
import Vacio from "./Vacio";

const TablaReservas = ({ allResState }) => {
  const reservasAca = allResState.Reservas_Aca || [];
  const reservasNAca = allResState.Reservas_NAca || [];

  const hayReservasNAca =
    Array.isArray(reservasNAca) && reservasNAca.length > 0;

  const reservasAMostrar = hayReservasNAca
    ? [...reservasAca, ...reservasNAca]
    : reservasAca;

  const longitudReservas = hayReservasNAca
    ? reservasAMostrar.length
    : reservasAca.length;

  const [reservas, setReservas] = useState(reservasAMostrar);

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "#efb810";
      case "Rechazada":
        return "#cb3234";
      case "Aprobada":
        return "green";
      default:
        return "black";
    }
  };

  const CollapsibleTable = () => {
    const [expandedRow, setExpandedRow] = useState(null);

    const manejoAcordion = (rowId) => {
      setExpandedRow(expandedRow === rowId ? null : rowId);
    };

    const estadoReserva = async (reservaId, status) => {
      let body = {
        Estado: status,
      };
      try {
        const response = await peticionForm(
          `https://www.sire.software/admin/cambiar_estado/${reservaId}`,
          "PATCH",
          body
        );
        message.success("Se cambio el estado de la reserva con exito");
        setTimeout(() => {
          window.location.reload();
        }, 500);
        return response;
      } catch (error) {
        console.error("Error al cambiar el estado de la reserva:", error);
        message.error("Error al cambiar el estado de la reserva");
      }
    };

    const cambiarEstadoReserva = async (reservaId, estado) => {
      try {
        const body = { Estado: estado };
        const response = await peticionForm(
          `https://www.sire.software/admin/cambiar_estado/${reservaId}`,
          "PATCH",
          body
        );
        message.success(`La reserva ha sido ${estado} exitosamente`);
        setTimeout(() => {
          window.location.reload();
        }, 800);
        return response;
      } catch (error) {
        console.error("Error al aprobar la reserva:", error);
        message.error("Error al aprobar la reserva");
      }
    };

    return (
      <table className="tbl-reservas">
        <thead>
          <tr>
            <th>#</th>
            <th>Salón</th>
            <th>Nombre Solicitante</th>
            <th>Aforo</th>
            <th>Fecha</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Académico</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservas.length === 0 ? (
            <tr>
              <td colSpan="11">
                <Vacio style={{ width: "100%", height: "100%" }} />
              </td>
            </tr>
          ) : (
            reservas.map((reserva, index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => manejoAcordion(reserva.ID_Reserva)}
                  className={
                    expandedRow === reserva.ID_Reserva ? "active-row" : ""
                  }
                >
                  <td>{index + 1}</td>
                  <td>{reserva.Espacio}</td>
                  <td>{reserva.Nombre}</td>
                  <td>{reserva.Aforo}</td>
                  <td>
                    {reserva.Fecha_Inicio
                      ? reserva.Fecha_Inicio.split(" ")[0]
                      : ""}
                  </td>
                  <td>
                    {reserva.Fecha_Inicio
                      ? reserva.Fecha_Inicio.split(" ")[1]
                      : ""}
                  </td>
                  <td>
                    {reserva.Fecha_Fin ? reserva.Fecha_Fin.split(" ")[1] : ""}
                  </td>
                  <td>
                    {reserva.Nombre_Docente !== null &&
                    reserva.Nombre_Docente !== undefined
                      ? reserva.Nombre_Docente
                      : "No Aplica"}
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: getStatusColor(reserva.Estado),
                    }}
                  >
                    {expandedRow === reserva.ID_Reserva ? (
                      <span>{reserva.Estado}</span>
                    ) : (
                      reserva.Estado
                    )}
                  </td>
                </tr>
                {expandedRow === reserva.ID_Reserva && (
                  <tr>
                    <td colSpan="11">
                      <div className="collapsible-content">
                        <p>
                          <span className="tag-rs">
                            Pendiente de confirmación
                          </span>{" "}
                          <span className="tag-rs">Fecha próxima</span>
                        </p>
                        <h5>
                          <span>Motivo</span> <br />
                          {reserva.Motivo}
                        </h5>
                        <div className="cnt-btn-reservas">
                          <button
                            className="btn-aprobar-reservas"
                            onClick={() =>
                              cambiarEstadoReserva(
                                reserva.ID_Reserva,
                                "Aprobada"
                              )
                            }
                          >
                            Aprobar
                          </button>
                          <button
                            className="btn-eliminar-reservas"
                            onClick={() =>
                              cambiarEstadoReserva(
                                reserva.ID_Reserva,
                                "Rechazada"
                              )
                            }
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return <CollapsibleTable />;
};

export default TablaReservas;
