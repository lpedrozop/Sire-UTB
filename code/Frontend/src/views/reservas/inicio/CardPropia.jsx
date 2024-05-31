import "../../../styles/reservas/Principal/profesor.css";
import { BiBadgeCheck, BiBuildings, BiTime } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";

function CardPropia({ reserva, cancelarReserva }) {
  const fechaInicio = new Date(reserva.Fh_Ini);

  const fechaISO = fechaInicio.toISOString();
  const [fecha, horaUTC] = fechaISO.split("T");

  const hora = horaUTC.slice(0, 5);

  const manejoCancelarReserva = () => {
    cancelarReserva(reserva.ID_Reserva);
  };

  return (
    <div className="card-propia">
      <div className="head-propia">
        <h6>{fecha}</h6>
      </div>
      <div className="content-propia">
        <div className="icon-text">
          <div>
            <BiBadgeCheck /> {reserva.Estado}
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
          <button
            className="btn-cancelar-reserva"
            onClick={manejoCancelarReserva}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardPropia;
