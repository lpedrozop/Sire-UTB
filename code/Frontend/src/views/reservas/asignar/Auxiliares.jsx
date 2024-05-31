import React, { useState, useEffect } from "react";
import "../../../styles/reservas/asignar/auxiliares.css";
import AuxPicker from "./AuxPicker";
import AuxAssign from "./AuxAssign";
import { peticionForm } from "../../../utils/peticiones";
import { obtenerIniciales } from "../../../utils/initials";
import Vacio from "../../reservas/inicio/Vacio";
import { message, Modal, Input } from "antd";

const { confirm } = Modal;

function Auxiliares() {
  const [selectedAux, setSelectedAux] = useState(null);
  const [listAux, setListAux] = useState([]);
  const [auxCtg, setAuxCtg] = useState([]);
  const [auxInfo, setAuxInfo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await peticionForm(
          "https://www.sire.software/admin/getall_aux",
          "GET"
        );

        const auxCatalogados = await peticionForm(
          "https://www.sire.software/admin/auxiliares",
          "GET"
        );

        setAuxCtg(auxCatalogados);
        setListAux(response.Auxiliares);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const manejoSeleccionAux = (id) => {
    const selectedAux = listAux.find((aux) => aux.ID_User === id);
    setSelectedAux(selectedAux);

    const auxAsignados = Array.isArray(auxCtg?.Aux_Asignados)
      ? auxCtg.Aux_Asignados
      : [];
    const auxNoAsignados = Array.isArray(auxCtg?.Aux_NoAsignados)
      ? auxCtg.Aux_NoAsignados
      : [];

    const allAux = [...auxAsignados, ...auxNoAsignados];
    const foundAuxCtg = allAux.find((aux) => aux.ID_User === id);
    setAuxInfo(foundAuxCtg);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    const crearAuxiliar = async () => {
      const body = {
        ID_User: codigo,
        Nombre: nombre,
      };
      try {
        const responsePeticion = await peticionForm(
          "https://www.sire.software/admin/create_aux",
          "POST",
          body
        );

        message.success("Auxiliar creado correctamente");
        const fetchData = async () => {
          try {
            const response = await peticionForm(
              "https://www.sire.software/admin/getall_aux",
              "GET"
            );

            const auxCatalogados = await peticionForm(
              "https://www.sire.software/admin/auxiliares",
              "GET"
            );

            setAuxCtg(auxCatalogados);
            setListAux(response.Auxiliares);
            return responsePeticion;
          } catch (error) {
            console.error("Error al obtener los datos:", error);
          }
        };
        fetchData();
        setNombre("");
        setCodigo("");
      } catch (error) {
        console.error("Error al crear el auxiliar:", error);
        message.error("Error al crear el auxiliar");
      }
    };
    crearAuxiliar();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="auxiliares">
      <div className="aux-list">
        <h5>Lista Auxiliares</h5>
        <button className="btn-crear-aux" onClick={showModal}>
          Crear Auxiliar
        </button>
        {listAux.length > 0 ? (
          listAux.map((aux) => (
            <div
              key={aux.ID_User}
              className={`aux-card ${
                selectedAux && aux.ID_User === selectedAux.ID_User
                  ? "selected"
                  : ""
              }`}
              onClick={() => manejoSeleccionAux(aux.ID_User)}
            >
              <div className="aux-initials">{obtenerIniciales(aux.Nombre)}</div>
              <div className="aux-details">
                <p className="aux-name">{aux.Nombre}</p>
              </div>
            </div>
          ))
        ) : (
          <Vacio />
        )}
      </div>
      <div className="aux-picker">
        {selectedAux ? (
          <AuxPicker selectedAux={selectedAux} auxInfo={auxInfo} />
        ) : (
          <Vacio />
        )}
      </div>
      <div className="aux-assign">
        {selectedAux ? (
          <AuxAssign selectedAux={selectedAux} auxInfo={auxInfo} />
        ) : (
          <Vacio />
        )}
      </div>
      <Modal
        title="Crear Auxiliar"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Input
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{ marginTop: "1rem" }}
        />
      </Modal>
    </div>
  );
}

export default Auxiliares;
