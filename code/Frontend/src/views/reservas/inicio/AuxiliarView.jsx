import "../../../styles/reservas/Principal/auxiliar.css";
import { peticionForm } from "../../../utils/peticiones";
import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import {
  BiCalendarCheck,
  BiBuildings,
  BiBadgeCheck,
  BiTime,
} from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { message, Popover, Input } from "antd";
import Vacio from "./Vacio";
import "../../../styles/reservas/Principal/profesor.css";

function CardPropia({ reserva }) {
  const fechaInicio = new Date(reserva.Fh_Ini);

  const fechaISO = fechaInicio.toISOString();
  const [fecha, horaUTC] = fechaISO.split("T");

  const hora = horaUTC.slice(0, 5);

  return (
    <div className="card-propia">
      <div className="head-propia">
        <h6>{fecha}</h6>
      </div>
      <div className="content-propia">
        <div className="icon-text">
          <div>
            <BiBadgeCheck /> {reserva.Nombre}
          </div>
          <div>
            <LuUsers /> {reserva.Aforo}
          </div>
        </div>
        <div className="icon-text">
          <div>
            <BiBuildings />
            {reserva.ID_Espacio}
          </div>
          <div>
            <BiTime />
            {hora}
          </div>
        </div>
        <div className="cnt-btn-cancelar">
          <Popover
            content={<PopoverContent reserva={reserva} />}
            title="Reporte"
            trigger="click"
            placement="top"
          >
            <button className="btn-reporte-reserva">Reporte</button>
          </Popover>
        </div>
      </div>
    </div>
  );
}

const { TextArea } = Input;

function Historial({ reserva }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScrollOutside = () => {
      setVisible(false);
    };

    const mainContainer = document.querySelector(".historial-reservas");
    if (mainContainer) {
      mainContainer.addEventListener("scroll", handleScrollOutside);
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener("scroll", handleScrollOutside);
      }
    };
  }, []);

  if (!reserva) {
    message.error("No hay asignaciones");
  }

  return (
    <div className="card-propia-historial">
      <div className="head-propia">
        <h6>{reserva?.Horas}</h6>
      </div>
      <div className="content-propia-historial">
        <div className="icon-text-historial">
          <div>
            <BiBuildings /> {reserva?.ID_Espacio}
          </div>
          <div>
            <LuUsers /> {reserva?.Nombre}
          </div>
        </div>
        <div className="cnt-btn-cancelar">
          <Popover
            content={<PopoverContent reserva={reserva} />}
            title="Reporte"
            trigger="click"
            placement="top"
            open={visible}
            onOpenChange={setVisible}
          >
            <button className="btn-reporte-reserva">Reporte</button>
          </Popover>
        </div>
      </div>
    </div>
  );
}

const PopoverContent = ({ reserva }) => {
  const [descripcion, setDescripcion] = useState("");
  const [huboNovedad, setHuboNovedad] = useState(false);
  const [enviarReporte, setEnviarReporte] = useState(false);

  const handleEnviarReporte = async () => {
    if (!reserva) {
      message.error("No hay reserva disponible para enviar reporte");
      return;
    }

    try {
      let body;
      const idKey = reserva.ID_Reserva ? "ID_Reserva" : "ID_Horario";

      if (huboNovedad) {
        body = {
          [idKey]: reserva.ID_Reserva || reserva.ID_Horario,
          Pre_Reporte: 1,
          Descripcion: descripcion,
        };
      } else {
        body = {
          [idKey]: reserva.ID_Reserva || reserva.ID_Horario,
          Pre_Reporte: 0,
        };
      }

      const response = await peticionForm(
        "https://www.sire.software/aux/reporte",
        "POST",
        body
      );
      message.success("El reporte se ha enviado exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return response;
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      message.error("Error al enviar el reporte");
    }
  };

  const handleSiClick = () => {
    setHuboNovedad(true);
    setEnviarReporte(true);
  };

  const handleNoClick = async () => {
    setHuboNovedad(false);
    setEnviarReporte(false);
    await handleEnviarReporte();
  };

  return (
    <div>
      {!enviarReporte && (
        <>
          <p>Hubo novedad alguna:</p>
          <button className="btns-actions-ys" onClick={handleSiClick}>
            Sí
          </button>
          <button className="btns-actions-no" onClick={handleNoClick}>
            No
          </button>
        </>
      )}
      {(huboNovedad || enviarReporte) && (
        <div>
          <p>Descripción (máximo 500 caracteres):</p>
          <TextArea
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={500}
          />
          {enviarReporte && (
            <div>
              <button onClick={handleEnviarReporte} className="btn-send-report">
                Enviar reporte
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function AuxiliarView() {
  const [infoReservas, setInfoReservas] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reserva = await peticionForm(
          "https://www.sire.software/aux/espaciosaux",
          "GET"
        );

        if (reserva && reserva.Reservas) {
          setReservas(reserva.Reservas);
        }
        if (reserva && reserva.Clases_regulares) {
          setInfoReservas(reserva.Clases_regulares);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cnt-auxiliar">
      <div className="header-estudiantes">
        <div className="cnt-ms-reservas">
          <div className="title-reservas-profesores">
            <BiCalendarCheck />
            <h5>Reservas </h5>
          </div>
          {reservas.length > 0 ? (
            <div className="propia-reserva">
              {reservas.map((reserva, index) => (
                <CardPropia key={index} reserva={reserva} />
              ))}
            </div>
          ) : (
            <Vacio />
          )}
        </div>
        <div className="cnt-historial-reservas">
          <div className="title-historial-profesores">
            <FaChalkboardTeacher />
            <h5>Clases regulares</h5>
          </div>
          {infoReservas.length > 0 ? (
            <div className="historial-reservas">
              {infoReservas.map((reserva, index) => (
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

export default AuxiliarView;
