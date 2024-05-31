import { useState } from "react";
import "../../../styles/reservas/calendario/picker.css";
import { peticionForm } from "../../../utils/peticiones";
import { message } from "antd";
import Vacio from "../inicio/Vacio";

function PickerCalendario({ aulas, setAulas }) {
  const [salonSeleccionado, setSalonSeleccionado] = useState("");

  const handleSalonChange = (e) => {
    const salonId = e.target.value;
    const salonSeleccionado = aulas.find(
      (salon) => salon.ID_Espacio === salonId
    );
    if (salonSeleccionado) {
      setSalonSeleccionado(salonSeleccionado);
    }
  };

  const handleBloquearClick = async () => {
    if (!salonSeleccionado) {
      return;
    }

    let nuevaDisponibilidad;
    if (salonSeleccionado.Disponibilidad === 1) {
      nuevaDisponibilidad = 0;
    } else {
      nuevaDisponibilidad = 1;
    }

    const body = {
      Disponibilidad: nuevaDisponibilidad,
    };

    try {
      const response = await peticionForm(
        `https://www.sire.software/admin/cambiar_est_esp/${salonSeleccionado.ID_Espacio}`,
        "PATCH",
        body
      );

      message.success(response.message);
      const updatedAulas = aulas.map((aula) =>
        aula.ID_Espacio === salonSeleccionado.ID_Espacio
          ? { ...aula, Disponibilidad: nuevaDisponibilidad }
          : aula
      );
      setAulas(updatedAulas);
    } catch (error) {
      console.error("Error al cambiar el estado del salón:", error);
    }
  };

  const salonesRestringidos = aulas.filter(
    (salon) => salon.Disponibilidad === 0
  );

  return (
    <div className="body-left">
      <div className="header-body-left">
        <h5>Cambiar estado</h5>
      </div>
      <div className="content-body-left">
        <div className="top-body-cnt">
          <div>
            <select onChange={handleSalonChange}>
              <option value="">Seleccione un aula</option>
              {aulas.map((salon, index) => (
                <option key={index} value={salon.ID_Espacio}>
                  {salon.ID_Espacio}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn-bloquear"
            onClick={handleBloquearClick}
            disabled={!salonSeleccionado}
          >
            {salonSeleccionado && salonSeleccionado.Disponibilidad === 0
              ? "Desbloquear"
              : "Bloquear"}
          </button>
        </div>
        <div className="bottom-body-cnt">
          <h5>Salones restringidos</h5>
          <div className="cnt-salones-restringidos">
            {salonesRestringidos.length > 0 ? (
              salonesRestringidos.map((salon, index) => (
                <div key={index} className="card-salones-restringidos">
                  <h6>{salon.ID_Espacio}</h6>
                  <p>Campus {salon.Campus}</p>
                  <p>Capacidad de {salon.Capacidad}</p>
                </div>
              ))
            ) : (
              <Vacio />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PickerCalendario;
