import "../../styles/landing/header.css";
import { signIn } from "../../auth/authRedirect";

function Header() {
  const manejoInicioSesion = () => {
    signIn();
  };

  return (
    <section className="header-info">
      <div className="info-left">
        <div className="cnt-info-header">
          <h4>Sistema de reservas de espacios UTB</h4>
          <p>
            La Universidad Tecnologica de Bolivar te ofrece reservar espacios
            del campus de forma rapida y sencilla. Revisa la disponibilidad,
            completa tu solicitud y asegura tu espacio
          </p>
          <button className="btn-formulario" onClick={manejoInicioSesion}>
            Ir al formulario
          </button>
        </div>
      </div>
    </section>
  );
}

export default Header;
