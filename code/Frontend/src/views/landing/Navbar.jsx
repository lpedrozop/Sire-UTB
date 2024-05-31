import "../../styles/landing/navbar.css";
import { Link } from "react-scroll";
import { useState } from "react";
import { BiAlignRight } from "react-icons/bi";
import LogoUtb from "../../assets/utb.png";
import { signIn } from "../../auth/authRedirect";

function NavbarComponent() {
  const [abrirMenu, setAbrirMenu] = useState(false);

  const retraerMenu = () => {
    setAbrirMenu(!abrirMenu);
  };

  const cerrarMenu = () => {
    setAbrirMenu(false);
  };

  const manejoInicioSesion = () => {
    signIn();
  };

  return (
    <nav className="navbar">
      <div className="container-nav">
        <div className="logo">
          <img src={LogoUtb} className="logo-size" alt="injectup" />
        </div>
        <div className="menu-icon" onClick={retraerMenu}>
          <BiAlignRight className="icon-nav" />
        </div>
        <div className={`nav-elements  ${abrirMenu && "active"}`}>
          <div className="links-nav">
            <ul>
              <li>
                <a href="#" onClick={cerrarMenu}>
                  Inicio
                </a>{" "}
              </li>
              <li>
                <Link
                  activeClass="active"
                  to="espacios-utb"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  onClick={cerrarMenu}
                >
                  Espacios
                </Link>
              </li>
              <li>
                <Link
                  activeClass="active"
                  to="contacto"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  onClick={cerrarMenu}
                >
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>
          <div className="social-nav">
            <ul>
              <li>
                <a onClick={manejoInicioSesion}>Iniciar Sesion</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
