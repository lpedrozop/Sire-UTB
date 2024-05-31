import 'dart:async';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/info_aux_model.dart';
import 'package:uloginazure/models/api_services_model.dart';

class AdminAuxProvider {
  late List<Usuario> _usuarios = [];

  final _asignacionesStreamController =
      StreamController<List<Asignacion>>.broadcast();

  final _usuariosStreamController = StreamController<List<Usuario>>.broadcast();

  Function(List<Asignacion>) get asignacionesSink =>
      _asignacionesStreamController.sink.add;

  Stream<List<Asignacion>> get combinedAsignacionStream =>
      _asignacionesStreamController.stream;

  Function(List<Usuario>) get usuariosSink =>
      _usuariosStreamController.sink.add;

  Stream<List<Usuario>> get usuariosStream => _usuariosStreamController.stream;

  void dispose() {
    _asignacionesStreamController.close();
    _usuariosStreamController.close();
  }

  // Peticiones
  Future<Map<String, dynamic>> getListAsignaciones(BuildContext context) async {
    try {
      final Map<String, dynamic> asignacionesData =
          await ApiService.fetchPatchAdmin(context,
              url: "https://www.sire.software/admin/auxiliares",
              method: 'get',
              fromJson: (json) => json as Map<String, dynamic>);

      final List<dynamic> auxAsignadosData = asignacionesData['Aux_Asignados'];
      final List<dynamic> auxNoAsignadosData =
          asignacionesData['Aux_NoAsignados'];

      List<Usuario> auxAsignados =
          auxAsignadosData.map((data) => Usuario.fromJson(data)).toList();
      List<Usuario> auxNoAsignados =
          auxNoAsignadosData.map((data) => Usuario.fromJson(data)).toList();

      // Agregar los usuarios a la lista _usuarios
      _usuarios = [...auxAsignados, ...auxNoAsignados];

      // Emitir la lista de usuarios asignados y no asignados
      usuariosSink([...auxAsignados, ...auxNoAsignados]);

      // Emitir las asignaciones para todos los usuarios
      List<Asignacion> allAsignaciones = [];
      auxAsignados.forEach((usuario) {
        allAsignaciones.addAll(usuario.asignaciones);
      });
      auxNoAsignados.forEach((usuario) {
        allAsignaciones.addAll(usuario.asignaciones);
      });
      asignacionesSink(allAsignaciones);

      return asignacionesData;
    } catch (e) {
      log('Error fetching Asignaciones: $e');
      rethrow;
    }
  }

  Usuario getUsuarioDeAsignacion(Asignacion asignacion) {
    for (var usuario in _usuarios) {
      if (usuario.asignaciones.contains(asignacion)) {
        return usuario;
      }
    }
    throw Exception('Usuario no encontrado para la asignación: $asignacion');
  }

  Future<Object> postEliminarAux(BuildContext context, String auxId) async {
    final url = 'https://www.sire.software/admin/delete_aux/$auxId';

    try {
      final responseList = await ApiService.fetchDelete<dynamic>(
        context,
        url: url,
        method: 'DELETE',
        fromJson: (json) => json,
      );
      return responseList;
    } catch (e) {
      log('Error al elimiar el usuario: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> postCrearAux(
      BuildContext context, String idUser, String nombre) async {
    const url = 'https://www.sire.software/admin/create_aux';
    final body = {
      'ID_User': idUser,
      'Nombre': nombre,
    };

    try {
      final responseList = await ApiService.fetchSingleItem<dynamic>(
        context,
        url: url,
        method: 'POST',
        body: body,
        fromJson: (json) => json,
      );
      return responseList;
    } catch (e) {
      log('Error create aux: $e');
      rethrow;
    }
  }
}
