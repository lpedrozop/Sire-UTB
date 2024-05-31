export const redireccionar = (direccion) => {
  if (direccion.startsWith("http")) {
    window.location.href = direccion;
  } else {
    window.location.pathname = direccion;
  }
};
