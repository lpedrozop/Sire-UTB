class ListaAux {
  final List<Aux> auxiliares;

  ListaAux({required this.auxiliares});

  factory ListaAux.fromJson(Map<String, dynamic> json) {
    var auxiliaresList = json['Auxiliares'] as List;
    List<Aux> auxiliares = auxiliaresList
        .map((auxiliarJson) => Aux.fromJson(auxiliarJson))
        .toList();

    return ListaAux(auxiliares: auxiliares);
  }
}

class Aux {
  final String idUser;
  final String nombre;
  final String? correo;
  final String rol;

  Aux({
    required this.idUser,
    required this.nombre,
    required this.rol,
    this.correo,
  });

  factory Aux.fromJson(Map<String, dynamic> json) {
    return Aux(
      idUser: json['ID_User'],
      nombre: json['Nombre'],
      correo: json['Correo'],
      rol: json['Rol'],
    );
  }
}
