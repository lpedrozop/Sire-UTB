import React, { useState } from "react";
import { Modal, DatePicker, Button, Checkbox } from "antd";
import esES from "antd/es/locale/es_ES";

const UsoReservaConEstados = ({ visible, onCancel, onGenerateReport }) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [estados, setEstados] = useState([]);

  const handleGenerateReport = () => {
    if (fechaInicio && fechaFin) {
      onGenerateReport(
        fechaInicio.format("YYYY-MM-DD"),
        fechaFin.format("YYYY-MM-DD"),
        estados
      );
    }
  };

  const handleEstadoChange = (estado) => {
    if (estados.includes(estado)) {
      setEstados(estados.filter((e) => e !== estado));
    } else {
      setEstados([...estados, estado]);
    }
  };

  return (
    <Modal
      title="Generar reporte general por estados"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleGenerateReport}>
          Generar Reporte
        </Button>,
      ]}
    >
      <div>
        <DatePicker
          onChange={(date) => setFechaInicio(date)}
          placeholder="Fecha de inicio"
          style={{ marginRight: "10px" }}
          locale={esES}
          showNow={false}
        />
        <DatePicker
          onChange={(date) => setFechaFin(date)}
          placeholder="Fecha de fin"
          locale={esES}
          showNow={false}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Checkbox
          onChange={() => handleEstadoChange("Aprobada")}
          checked={estados.includes("Aprobada")}
        >
          Aprobada
        </Checkbox>
        <Checkbox
          onChange={() => handleEstadoChange("Rechazada")}
          checked={estados.includes("Rechazada")}
        >
          Rechazada
        </Checkbox>
        <Checkbox
          onChange={() => handleEstadoChange("Pendiente")}
          checked={estados.includes("Pendiente")}
        >
          Pendiente
        </Checkbox>
      </div>
    </Modal>
  );
};

export default UsoReservaConEstados;
