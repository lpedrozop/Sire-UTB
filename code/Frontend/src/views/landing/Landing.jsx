import NavbarComponent from "./Navbar";
import Header from "./Header";
import Publish from "./Publish";
import EspacioComponent  from "./Espacio";
import Contacto from "./Contacto";
import Footer from "./Footer";

function Landing() {
  return (
    <>
      <NavbarComponent />
      <Header />
      <Publish />
      <EspacioComponent />
      <Contacto />
      <Footer />
    </>
  );
}

export default Landing;
