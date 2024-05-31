import LogoUtb from "../../assets/utb-blanco.png";
import "../../styles/landing/footer.css";
import {
  BiLogoTiktok,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoYoutube,
} from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="cnt-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={LogoUtb} alt="Logo UTB" className="utb-logo-blanco" />
            <h4>Universidad Tecnológica de Bolívar</h4>
            <p>
              Universidad Tecnologica de Bolivar - 2017 institucion de Educacion
              Superior sujeta a inspeccion y vigilancia por el Ministerio de
              Educacion Nacional.
            </p>
            <p>
              Resolucion No 961 del 26 de Octubre de 1970 a traves de la cual la
              Gobernacion de Bolivar otorga la Personeria Juridica a la
              Universidad Tecnologica de Bolivar
            </p>
            <div className="cnt-icono-footer">
              <BiLogoFacebook />
              <BiLogoInstagram />
              <BiLogoLinkedin />
              <BiLogoTiktok />
              <BiLogoYoutube />
            </div>
          </div>

          <div className="footer-contact">
            <h4>¿Donde estamos?</h4>
            <h4>Campus Tecnológico</h4>
            <p>Parque Industrial y Tecnológico Carlos Vélez</p>
            <p>Pombo Km 1 Vía Turbaco</p>
            <p>Tel: +57 605 6931919</p>

            <h4>Campus Casa Lemaitre</h4>
            <p>Calle del Bouquet Cra.21 #25-92 Barrio Manga</p>
            <p>Tel: +57 605 6931919</p>
            <p>Cartagena - Colombia</p>
          </div>

          <div className="footer-info">
            <h4>Contacto</h4>
            <p>
              Para cualquier duda o caso en particular sobre las reservas de
              nuestros espacios en nuestro campus UTB, comuniquese al siguiente
              correo electrónico:
            </p>
            <p>fruiz@utb.edu.co</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
