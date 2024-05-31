export function obtenerIniciales(nombre) {
  const palabras = nombre.split(" ");

  let iniciales = "";

  for (let i = 0; i < 2 && i < palabras.length; i++) {
    iniciales += palabras[i].charAt(0).toUpperCase();
  }

  return iniciales;
}
