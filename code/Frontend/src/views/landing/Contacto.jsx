import "../../styles/landing/contacto.css";
import { Element } from "react-scroll";

function Contacto() {
  return (
    <Element name="contacto">
      <section className="cnt-contacto">
        <div className="cnt-contenido-contacto">
          <p>
            Para cualquier consulta o duda, no duden en contactarnos <br /> a
            traves de este correo electronico:
          </p>
          <h4>fruiz@utb.edu.co</h4>
        </div>
      </section>
    </Element>
  );
}

export default Contacto;
