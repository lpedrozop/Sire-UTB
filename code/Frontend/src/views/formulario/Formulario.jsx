import React, { useEffect, useState } from "react";
import "../../styles/formulario/formulario.css";
import LeftForm from "./LeftForm";
import RightForm from "./RightForm";
import { peticionForm } from "../../utils/peticiones";

function Formulario() {
  const [materias, setMaterias] = useState([]);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await peticionForm(
          "https://sire-utb-x2ifq.ondigitalocean.app/form/materia",
          "GET"
        );
        setMaterias(data.materias);
        setFormData(data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cnt-background">
      <div className="cnt-color-bcg">
        <div className="cnt-left-display">
          <LeftForm />
        </div>
        <div className="cnt-right-display">
          <RightForm materias={materias} />
        </div>
      </div>
    </div>
  );
}

export default Formulario;
