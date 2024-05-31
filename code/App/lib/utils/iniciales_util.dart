String obtenerIniciales(String input) {
  List<String> palabras = input.split(' ');

  List<String> iniciales = [];

  for (int i = 0; i < palabras.length && i < 2; i++) {
    String palabra = palabras[i].trim();
    if (palabra.isNotEmpty) {
      iniciales.add(palabra[0]);
    }
  }

  return iniciales.join('');
}
