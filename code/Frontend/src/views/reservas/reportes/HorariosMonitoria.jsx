import React, { useState } from "react";
import { DatePicker, TimePicker, message } from "antd";
import "../../../styles/reservas/Principal/headerPrincipal.css";
import { peticionForm } from "../../../utils/peticiones";

const HorariosMonitoria = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [aforo, setAforo] = useState("");
  const [campus, setCampus] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [aulasDisponibles, setAulasDisponibles] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState("");

  const manejoDisponibilidad = async () => {
    if (aforo && campus && schedules.length > 0) {
      const requestBody = {
        Aforo: parseInt(aforo),
        Campus: campus,
      };

      schedules.forEach((schedule) => {
        requestBody[
          schedule.selectedDay
        ] = `${schedule.selectedStartTime.format(
          "HH:mm"
        )}-${schedule.selectedEndTime.format("HH:mm")}`;
      });

      try {
        const response = await peticionForm(
          "https://www.sire.software/admin/valide",
          "POST",
          requestBody
        );

        setAulasDisponibles(response.aulas.Disponibles);
      } catch (error) {
        message.error("Error al procesar la solicitud:");
      }
    } else {
      message.error("Por favor complete todos los campos");
    }
  };

  const crearHorario = async () => {
    if (
      selectedStartTime &&
      selectedEndTime &&
      aforo &&
      campus &&
      selectedSalon
    ) {
      const startHour = selectedStartTime.format("HH:mm");
      const endHour = selectedEndTime.format("HH:mm");

      const requestBody = {
        Aforo: parseInt(aforo),
        Campus: campus,
        [selectedDay]: `${startHour}-${endHour}`,
        ID_Espacio: selectedSalon,
        ID_User: "T00061228",
        Fecha_Inicio: selectedStartTime.format("YYYY-MM-DD"),
        Fecha_Fin: selectedEndTime.format("YYYY-MM-DD"),
      };

      try {
        const response = await peticionForm(
          "https://www.sire.software/admin/create_clase",
          "POST",
          requestBody
        );

        message.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 700);
      } catch (error) {
        message.error("Error al crear el horario");
      }
    } else {
      message.error("Por favor complete todos los campos");
    }
  };

  const agregarDiv = () => {
    setSchedules([
      ...schedules,
      { selectedDay: "", selectedStartTime: null, selectedEndTime: null },
    ]);
  };

  return (
    <div>
      <div className="cnt-head-primary">
        <div className="cnt-campus-aforo">
          <input
            placeholder="Aforo"
            value={aforo}
            onChange={(e) => setAforo(e.target.value)}
          />
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
          >
            <option value="">Campus</option>
            <option value="TE">Ternera</option>
            <option value="MA">Manga</option>
          </select>
        </div>
        {schedules.map((schedule, index) => (
          <div key={index} className="day-range">
            <select
              value={schedule.selectedDay}
              onChange={(e) => {
                const newSchedules = [...schedules];
                newSchedules[index].selectedDay = e.target.value;
                setSchedules(newSchedules);
                setSelectedDay(e.target.value);
              }}
              style={{ width: 120, marginRight: "10px" }}
            >
              <option value="">Día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
            <button
              onClick={() =>
                setSchedules(schedules.filter((_, i) => i !== index))
              }
            >
              -
            </button>
            <div>
              <TimePicker.RangePicker
                showTime={{ format: "HH:mm" }}
                format="HH:mm"
                placeholder={["Hora de inicio", "Hora de fin"]}
                value={[schedule.selectedStartTime, schedule.selectedEndTime]}
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    const newSchedules = [...schedules];
                    newSchedules[index].selectedStartTime = dates[0];
                    newSchedules[index].selectedEndTime = dates[1];
                    setSchedules(newSchedules);
                  }
                }}
                style={{ marginRight: "10px" }}
              />
            </div>
          </div>
        ))}

        <button type="button"  className="btn-add-schedule" onClick={agregarDiv}>
          +
        </button>
        <button type="button" className="btn-post-schedule" onClick={manejoDisponibilidad}>
          Revisar Disponibilidad
        </button>
      </div>

      <div className="bottom-post-secondary">
        {aulasDisponibles.length > 0 && (
          <div>
            <div className="head-salones-apl">
              <h3>Salones Disponibles:</h3>
              <select onChange={(e) => setSelectedSalon(e.target.value)}>
                <option value="">Selecciona un salón</option>
                {aulasDisponibles.map((aula, index) => (
                  <option key={index} value={aula.ID_Espacio}>
                    {aula.Salon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <DatePicker.RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD"
                placeholder={["Fecha de inicio", "Fecha de fin"]}
                value={[selectedStartTime, selectedEndTime]}
                onChange={(dates) => {
                  if (dates && dates.length === 1) {
                    setSelectedStartTime(dates[0]);
                    const endDate = new Date(dates[0]);
                    endDate.setHours(endDate.getHours() + 2);
                    setSelectedEndTime(endDate);
                  } else if (dates && dates.length === 2) {
                    setSelectedStartTime(dates[0]);
                    setSelectedEndTime(dates[1]);
                  } else {
                    setSelectedStartTime(null);
                    setSelectedEndTime(null);
                  }
                }}
                style={{ marginRight: "10px" }}
              />
            </div>
            <button type="primary" className="btn-post-horario" onClick={crearHorario}>
              Crear Horario
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorariosMonitoria;
