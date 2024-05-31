import "../../../styles/reservas/calendario/calendario.css";
import PickerCalendario from "./PickerCalendario";
import StoryLine from "./StoryLine";
import { useEffect, useState } from "react";
import { peticionForm } from "../../../utils/peticiones";

function CntCalendario() {
  const [aulas, setAulas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [aux, setAux] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await peticionForm(
          "https://www.sire.software/admin/get_espacios",
          "GET"
        );

        const reservas = await peticionForm(
          "https://www.sire.software/admin/reservas_apro",
          "GET"
        );

        const getAux = await peticionForm(
          "https://www.sire.software/admin/getall_aux",
          "GET"
        );

        setAux(getAux.Auxiliares);
        setReservas(reservas);
        setAulas(response.Espacios_Total);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="picker-calendario">
      <PickerCalendario aulas={aulas} setAulas={setAulas} />
      <StoryLine reservas={reservas} aux={aux} />
    </div>
  );
}

export default CntCalendario;
