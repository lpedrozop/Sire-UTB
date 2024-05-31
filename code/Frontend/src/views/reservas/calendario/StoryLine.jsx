import "../../../styles/reservas/calendario/storyline.css";
import TimeLine from "./TimeLine";

function Storyline({ reservas, aux }) {
  const maxAvatars = 3;

  const perfilAvatar = (aux) => {
    const sortAux = [...aux].sort((a, b) => a.Nombre.localeCompare(b.Nombre));
    const displayedAux = sortAux.slice(0, maxAvatars);

    return (
      <div className="avatar-container">
        {displayedAux.map((user, index) => (
          <div
            className="avatar-profile"
            key={index}
            style={{ backgroundColor: colorAleatorio() }}
          >
            {obtenerIniciales(user.Nombre)}
          </div>
        ))}
        {aux.length > maxAvatars && (
          <div className="avatar-profile-more">+{aux.length - maxAvatars}</div>
        )}
      </div>
    );
  };

  const colorAleatorio = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const obtenerIniciales = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    return initials;
  };

  return (
    <div className="story-line">
      <div className="head-story">
        <h5>Calendario </h5>
        {perfilAvatar(aux)}
      </div>
      <TimeLine reservas={reservas} />
    </div>
  );
}

export default Storyline;
