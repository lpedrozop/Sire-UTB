import "../../../styles/reservas/Principal/card.css";
import React, { useRef } from "react";
import { BiBookBookmark, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Vacio from "./Vacio";

function CardReserva({ allResState }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const currentPosition = scrollContainerRef.current.scrollLeft;
      const newPosition = currentPosition - 900;
      scrollToSmoothly(newPosition, 100);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const currentPosition = scrollContainerRef.current.scrollLeft;
      const newPosition = currentPosition + 900;
      scrollToSmoothly(newPosition, 100);
    }
  };

  const scrollToSmoothly = (position, duration) => {
    const startTime = performance.now();
    const start = scrollContainerRef.current.scrollLeft;
    const end = position;

    const animateScroll = (time) => {
      const elapsed = time - startTime;

      if (elapsed < duration) {
        scrollContainerRef.current.scrollLeft = easeInOut(
          elapsed,
          start,
          end - start,
          duration
        );
        requestAnimationFrame(animateScroll);
      } else {
        scrollContainerRef.current.scrollLeft = end;
      }
    };

    const easeInOut = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animateScroll);
  };

  const currentDate = new Date().toISOString().slice(0, 10);

  const allReservas = allResState.Reservas_Aca.concat(
    allResState.Reservas_NAca
  );

  const filteredReservas = allReservas.filter(
    (reserva) => reserva.Fecha_Inicio.split(" ")[0] === currentDate
  );

  return (
    <div className="cards-reservas-wrapper">
      <div className="scroll-buttons">
        <button id="boton-card-izquierda" onClick={scrollLeft}>
          <BiChevronLeft />
        </button>
        <button id="boton-card-derecha" onClick={scrollRight}>
          <BiChevronRight />
        </button>
      </div>
      <div className="cards-reservas" ref={scrollContainerRef}>
        {filteredReservas.length > 0 ? (
          filteredReservas.map((reserva, index) => (
            <div key={index} className="card-container">
              <div className="card-content">
                <div className="header-card">
                  <h3 className="card-title">{reserva.Espacio}</h3>
                  <BiBookBookmark />
                </div>
                <div className="foot-card">
                  <p className="card-description">
                    {reserva.Fecha_Inicio.split(" ")[1]}
                  </p>
                  <div className="ft-crd">
                    <h5>{reserva.Nombre}</h5>
                    <div className="estado-color">{reserva.Estado}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Vacio />
        )}
      </div>
    </div>
  );
}

export default CardReserva;
