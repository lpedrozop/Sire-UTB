import React, { useState, useEffect } from "react";
import "../../../styles/reservas/calendario/timeline.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs, { locale } from "dayjs";
import moment from "moment";
import "moment/locale/es";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

dayjs.locale("es");

const TimeLine = ({ reservas }) => {
  const localizer = momentLocalizer(moment);

  let formats = {
    timeGutterFormat: "HH:mm",
  };

  const components = {
    event: (event) => {
      const horaActual = dayjs();

      if (
        event &&
        event.event &&
        event.event.end instanceof Date &&
        horaActual.isAfter(event.event.end)
      ) {
        return (
          <div className="event-closed">
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {event?.event.Nombre} <br /> {event?.event.Espacio}
            </div>
          </div>
        );
      } else {
        return (
          <div className="event-open">
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {event?.event.Nombre} <br /> {event?.event.Espacio}
            </div>
          </div>
        );
      }
    },
  };

  const CustomToolbar = ({ date, onNavigate, view, onView }) => {
    const manejoCambio = (action) => {
      onNavigate(action);
    };

    const cambioVista = (nuevaVista) => {
      if (nuevaVista !== view) {
        onView(nuevaVista);
      }
    };

    return (
      <div className="toolbar-calendar">
        <div className="calendar-buttons">
          <button
            className="btn-calendar-label btn-back-calendar"
            onClick={() => manejoCambio("PREV")}
          >
            <FaChevronLeft />
          </button>
          <label className="date-label">
            {date.toLocaleString("default", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </label>
          <button
            className="btn-calendar-label btn-next-calendar"
            onClick={() => manejoCambio("NEXT")}
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="container-filter">
          <button
            className={`bg-filter-${view === "day" ? "on" : "off"}`}
            onClick={() => cambioVista("day")}
          >
            <span className={`label-filter-${view === "day" ? "on" : "off"}`}>
              Dia
            </span>
          </button>
          <button
            className={`bg-filter-${view === "week" ? "on" : "off"}`}
            onClick={() => cambioVista("week")}
          >
            <span className={`label-filter-${view === "week" ? "on" : "off"}`}>
              Semana
            </span>
          </button>
          <button
            className={`bg-filter-${view === "month" ? "on" : "off"}`}
            onClick={() => cambioVista("month")}
          >
            <span className={`label-filter-${view === "month" ? "on" : "off"}`}>
              Mes
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="day-calendar">
      <Calendar
        localizer={localizer}
        events={[
          ...(reservas?.Reservas_Aca?.map((reserva) => ({
            ...reserva,
            start: new Date(reserva.Fecha_Inicio),
            end: new Date(reserva.Fecha_Fin),
          })) || []),
          ...(reservas?.Reservas_NAca?.map((reserva) => ({
            ...reserva,
            start: new Date(reserva.Fecha_Inicio),
            end: new Date(reserva.Fecha_Fin),
          })) || []),
        ]}
        views={["month", "week", "day"]}
        defaultView="month"
        showAllEvents={true}
        formats={formats}
        min={dayjs("2024-02-19T07:00:00").toDate()}
        max={dayjs("2024-02-19T23:59:00").toDate()}
        components={{
          event: components.event,
          toolbar: CustomToolbar,
        }}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default TimeLine;
