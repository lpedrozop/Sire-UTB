import "../../../styles/reservas/Principal/profesor.css";
import { BiBadgeCheck, BiBuildings, BiTime } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";

function Historial({ reserva }) {
  return (
    <div className="card-propia-historial">
      <div className="head-propia">
        <h6>{reserva.Estado}</h6>
      </div>
      <div className="content-propia-historial">
        <div className="icon-text-historial">
          <div>
            <BiBuildings /> {reserva.Aula}
          </div>
          <div>
            <LuUsers /> {reserva.Materia}
          </div>
          <div>
            <BiBadgeCheck />
            {reserva.Estudiante}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historial;
