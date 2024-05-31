import "../../../styles/reservas/asignar/auxassign.css";
import React, { useState, useEffect } from "react";
import { peticionForm } from "../../../utils/peticiones";
import { MdOutlineDelete } from "react-icons/md";
import { message, TimePicker } from "antd";
import Vacio from "../inicio/Vacio";

function disabledRangeTime(_, type) {
  if (type === "start") {
    return {
      disabledHours: () =>
        [...Array(7).keys(), ...Array(24).keys()].slice(0, 7),
    };
  }
  return {
    disabledHours: () => [...Array(24).keys()].slice(20, 24),
  };
}

function AuxAssign({ auxInfo }) {
  const [campus, setCampus] = useState("");
  const [espacios, setEspacios] = useState([]);
  const [espaciosDisabled, setEspaciosDisabled] = useState(true);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState("");
  const [timeWeek, setTimeWeek] = useState([null, null]);
  const [timeWeekend, setTimeWeekend] = useState([null, null]);

  const fetchData = async (selectedCampus) => {
    try {
      const response = await peticionForm(
        `https://www.sire.software/admin/get_bloques/${selectedCampus}`,
        "GET"
      );

      if (response && response.Bloques) {
        setEspacios(response.Bloques);
        setEspaciosDisabled(false);
      } else {
        console.error("La respuesta no contiene la propiedad 'Bloques'");
      }
    } catch (error) {
      message.error("No fue posible enviar el campus");
      console.error("Error al obtener los datos:", error);
    }
  };

  const manejoCampus = (event) => {
    const selectedCampus = event.target.value;
    setCampus(selectedCampus);
    setEspaciosDisabled(true);
    if (selectedCampus) {
      fetchData(selectedCampus);
    }
  };

  const manejoEspacio = (event) => {
    const selectedEspacio = event.target.value;
    setEspacioSeleccionado(selectedEspacio);
  };

  const manejoTimeWeek = (times) => {
    setTimeWeek(times);
  };

  const manejoTimeWeekeend = (times) => {
    setTimeWeekend(times);
  };

  const formatHourRange = (time) => {
    if (time && time.length === 2) {
      const startTime = time[0].format("H:mm");
      const endTime = time[1].format("H:mm");
      return `${startTime}-${endTime}`;
    } else {
      return null;
    }
  };

  const peticionAsignar = async (userID) => {
    try {
      let data = {};

      if (
        timeWeek.length === 2 &&
        timeWeek.every((time) => time !== null) &&
        timeWeekend.length === 2 &&
        timeWeekend.every((time) => time !== null)
      ) {
        data = {
          ID_User: userID,
          Bloque_L_V: espacioSeleccionado,
          Bloque_S: espacioSeleccionado,
          Lunes: formatHourRange(timeWeek),
          Martes: formatHourRange(timeWeek),
          Miércoles: formatHourRange(timeWeek),
          Jueves: formatHourRange(timeWeek),
          Viernes: formatHourRange(timeWeek),
          Sábado: formatHourRange(timeWeekend),
        };
      } else if (
        timeWeekend.length === 2 &&
        timeWeekend.every((time) => time !== null)
      ) {
        data = {
          ID_User: userID,
          Bloque_S: espacioSeleccionado,
          Sábado: formatHourRange(timeWeekend),
        };
      } else if (
        timeWeek.length === 2 &&
        timeWeek.every((time) => time !== null)
      ) {
        data = {
          ID_User: userID,
          Bloque_L_V: espacioSeleccionado,
          Lunes: formatHourRange(timeWeek),
          Martes: formatHourRange(timeWeek),
          Miércoles: formatHourRange(timeWeek),
          Jueves: formatHourRange(timeWeek),
          Viernes: formatHourRange(timeWeek),
        };
      } else {
        console.error("Error al enviar la data");
      }

      const response = await peticionForm(
        "https://www.sire.software/admin/asignar_aux",
        "POST",
        data
      );

      message.success(response.message);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      message.error(
        "Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al agregar la asignación:", error);
    }
  };

  const peticionDeleteAsignaciones = async (idUser) => {
    try {
      const response = await peticionForm(
        `https://www.sire.software/admin/delete_asignaciones/${idUser}`,
        "delete"
      );
      message.success("Asignaciones eliminada con exito", 5);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
      return response;
    } catch (e) {
      message.error(
        "Error al procesar la eliminacion. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al eliminar la asignación:", error);
    }
  };

  const peticionDeleteAsignacion = async (idAsignacion) => {
    try {
      const response = await peticionForm(
        `https://www.sire.software/admin/delete_asignacion/${idAsignacion}`,
        "delete"
      );
      message.success("Asignacion eliminada con exito", 5);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
      return response;
    } catch (e) {
      message.error(
        "Error al procesar la eliminacion. Por favor, inténtelo de nuevo más tarde."
      );
      console.error("Error al eliminar la asignación:", error);
    }
  };

  return (
    <div className="assign-cnt">
      <h5>Asignar</h5>
      <div className="assignment-container">
        <div className="assignment-inputs">
          <div className="top-inputs">
            <select value={campus} onChange={manejoCampus}>
              <option value="">Campus</option>
              <option value="TE">Ternera</option>
              <option value="MA">Manga</option>
            </select>
            <select
              disabled={espaciosDisabled}
              value={espacioSeleccionado}
              onChange={manejoEspacio}
            >
              <option value="" disabled>
                Seleccione un espacio
              </option>
              {espacios.map((espacio) => (
                <option key={espacio.Bloque} value={espacio.Bloque}>
                  {espacio.Bloque} {espacio.Salon}
                </option>
              ))}
            </select>
          </div>
          <div className="bottom-inputs">
            <div className="btn-div-cnt">
              <h6>Lunes a Viernes</h6>
              <TimePicker.RangePicker
                size="small"
                style={{ width: "100%", height: "7vh", lineHeight: "7vh" }}
                disabledTime={disabledRangeTime}
                format="HH:00"
                placeholder={["Hora de inicio", "Hora de fin"]}
                onChange={manejoTimeWeek}
                value={timeWeek}
              />
            </div>
            <div className="btn-div-cnt">
              <h6>Sabado</h6>
              <TimePicker.RangePicker
                size="small"
                style={{ width: "100%", height: "7vh", lineHeight: "7vh" }}
                disabledTime={disabledRangeTime}
                format="HH:00"
                placeholder={["Hora de inicio", "Hora de fin"]}
                onChange={manejoTimeWeekeend}
                value={timeWeekend}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <a
              className="btn-assign-aux"
              onClick={() => peticionAsignar(auxInfo.ID_User)}
            >
              Agregar asignación
            </a>
          </div>
        </div>
        <div className="established-assignments">
          <div className="head-established">
            <h4 className="h4-head">Asignaciones establecidas</h4>
            <button
              className="btn-delete-all"
              onClick={() => peticionDeleteAsignaciones(auxInfo.ID_User)}
            >
              Eliminar todas las asignaciones
            </button>
          </div>
          <div className="blocks">
            {auxInfo &&
              (!auxInfo.Asignaciones ? (
                <Vacio />
              ) : (
                auxInfo.Asignaciones.map((bloque) => (
                  <div key={bloque.Bloque} className="block">
                    <div className="header-block">
                      <h5>{bloque.Bloque}</h5>
                    </div>
                    {bloque.Asignaciones.map((asignacion) => (
                      <div
                        key={asignacion.ID_Asignacion_Bloque}
                        className="assignment-details"
                      >
                        <div className="head-assigment-time">
                          {asignacion.Horarios.Lunes && (
                            <h6>
                              Horario L a V: {asignacion.Horarios.Lunes}
                              <MdOutlineDelete
                                className="delete-icon"
                                onClick={() =>
                                  peticionDeleteAsignacion(
                                    asignacion.ID_Asignacion_Bloque
                                  )
                                }
                              />
                            </h6>
                          )}
                          {asignacion.Horarios.Sábado && (
                            <h6>
                              Sábado: {asignacion.Horarios.Sábado}
                              <MdOutlineDelete
                                className="delete-icon"
                                onClick={() =>
                                  peticionDeleteAsignacion(
                                    asignacion.ID_Asignacion_Bloque
                                  )
                                }
                              />
                            </h6>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuxAssign;
