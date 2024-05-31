import "../../styles/landing/espacios.css";
import { Element } from "react-scroll";
import Aulas from "../../assets/aulas.webp";
import Auditorio from "../../assets/auditorio.webp";
import Salas from "../../assets/salas-de-estudio.webp";
import { Carousel } from "antd";
import { signIn } from "../../auth/authRedirect";

function EspacioComponent() {
  const manejoInicioSesion = () => {
    signIn();
  };

  return (
    <Element name="espacios-utb">
      <section className="cnt-espacio">
        <div className="espacios-utb">
          <div className="carrousel-text">
            <h6>Reserva nuestros espacios</h6>
            <p>
              Ofrecemos aulas equipadas con tecnologia de vanguardia para
              garantizar un entorno academico optimo y enriquecedor, propicio
              para el proceso de enseñanza - aprendizaje.
            </p>
            <p>
              Nuestra infraestructura incluye todos los recursos necesarios para
              que las reservas academicas de nuestros estudiantes sean altamente
              satisfactorias y efectivas
            </p>
            <div className="cnt-btn-reservas">
              <button className="btn-formulario" onClick={manejoInicioSesion}>
                Quiero reservar un espacio
              </button>
            </div>
          </div>
          <div className="carrousel-ant-slick">
            <Carousel autoplay>
              <div className="item-carrousel">
                <img src={Aulas} alt="Aulas" />
              </div>
              <div className="item-carrousel">
                <img src={Auditorio} alt="Auditorio" />
              </div>
              <div className="item-carrousel">
                <img src={Salas} alt="Salas de Estudio" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
    </Element>
  );
}

export default EspacioComponent;
