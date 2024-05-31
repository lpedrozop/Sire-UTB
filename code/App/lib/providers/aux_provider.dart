import 'dart:async';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/api_services_model.dart';
import 'package:uloginazure/models/aux_model.dart';

class AuxProvider {
  final List<Auxiliar> _auxiliar = [];

  // Stream controller
  final _auxiliarStreamController =
      StreamController<List<Auxiliar>>.broadcast();

  // Sink
  Function(List<Auxiliar>) get auxiliaresSink =>
      _auxiliarStreamController.sink.add;

  // Stream
  Stream<List<Auxiliar>> get auxiliarStream => _auxiliarStreamController.stream;

  void dispose() {
    _auxiliarStreamController.close();
  }

  // Peticiones
  Future<List<Auxiliar>> getReservasAux(BuildContext context) async {
    try {
      final Auxiliar auxiliar = await ApiService.fetchSingleItem<Auxiliar>(
        context,
        url: 'https://api-aux-qazj7.ondigitalocean.app/aux/espaciosaux',
        method: 'get',
        fromJson: (json) {
          List<Reserva> reservas = (json['Reservas'] as List<dynamic>)
              .map((item) => Reserva.fromJson(item))
              .toList();
          List<ClaseRegular> clasesRegulares =
              (json['Clases_regulares'] as List<dynamic>)
                  .map((item) => ClaseRegular.fromJson(item))
                  .toList();
          return Auxiliar(reservas: reservas, clasesRegulares: clasesRegulares);
        },
      );

      _auxiliar.clear();
      _auxiliar.add(auxiliar);

      auxiliaresSink(_auxiliar);
      notifyListeners();

      return _auxiliar;
    } catch (e) {
      log('Error fetching auxiliar: $e');
      rethrow;
    }
  }

  void notifyListeners() {
    _auxiliarStreamController.add(_auxiliar);
  }

  Future<Map<String, dynamic>> postReserva(
      BuildContext context, String idReserva, int preReporte,
      {String? descripcion}) async {
    const url = 'https://api-aux-qazj7.ondigitalocean.app/aux/reporte';

    try {
      final Map<String, dynamic> body = {
        'ID_Reserva': idReserva,
        'Pre_Reporte': preReporte.toString(),
      };

      if (descripcion != null && descripcion.isNotEmpty) {
        body['Descripcion'] = descripcion;
      }

      final response = await ApiService.fetchPatch<dynamic>(
        context,
        url: url,
        method: 'post',
        body: body,
        fromJson: (json) => json,
      );

      return response;
    } catch (e) {
      log('Error updating reserva estado: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> postClase(
      BuildContext context, String idHorario, int preReporte,
      {String? descripcion}) async {
    const url = 'https://api-aux-qazj7.ondigitalocean.app/aux/reporte';

    try {
      final Map<String, dynamic> body = {
        'ID_Horario': idHorario,
        'Pre_Reporte': preReporte.toString(),
      };

      if (descripcion != null && descripcion.isNotEmpty) {
        body['Descripcion'] = descripcion;
      }

      final response = await ApiService.fetchPatch<dynamic>(
        context,
        url: url,
        method: 'post',
        body: body,
        fromJson: (json) => json,
      );

      return response;
    } catch (e) {
      log('Error updating reserva estado: $e');
      rethrow;
    }
  }
}
