import { BiSolidInbox } from "react-icons/bi";
import "../../../styles/reservas/Principal/auxiliar.css";

function Vacio() {
  return (
    <div className="cnt-vacio">
      <BiSolidInbox />
      <h5>No hay elementos</h5>
    </div>
  );
}

export default Vacio;
