import 'dart:async';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/list_reservas_model.dart';
import 'package:uloginazure/models/api_services_model.dart';

class AdminReservasProvider {
  final List<ReservaAdmin> _reservasAca = [];
  final List<ReservaAdmin> _reservasNAca = [];

  // Streams controller
  final _reservasAcaStreamController =
      StreamController<List<ReservaAdmin>>.broadcast();
  final _reservasNAcaStreamController =
      StreamController<List<ReservaAdmin>>.broadcast();
  final _combinedReservasStreamController =
      StreamController<List<ReservaAdmin>>.broadcast();

  // Sinks
  Function(List<ReservaAdmin>) get reservasAcaSink =>
      _reservasAcaStreamController.sink.add;
  Function(List<ReservaAdmin>) get reservasNAcaSink =>
      _reservasNAcaStreamController.sink.add;

  // Streams
  Stream<List<ReservaAdmin>> get reservasAcaStream =>
      _reservasAcaStreamController.stream;
  Stream<List<ReservaAdmin>> get reservasNAcaStream =>
      _reservasNAcaStreamController.stream;
  Stream<List<ReservaAdmin>> get combinedReservasStream =>
      _combinedReservasStreamController.stream;

  void dispose() {
    _reservasAcaStreamController.close();
    _reservasNAcaStreamController.close();
    _combinedReservasStreamController.close();
  }

  // Peticiones
  Future<Map<String, dynamic>> getReservasAdmin(BuildContext context) async {
    try {
      final response =
          await ApiService.fetchPatch<Map<String, dynamic>>(context,
              url: "https://www.sire.software/admin/get_reservas",
              method: 'get',
              fromJson: (json) => {
                    'Reservas_Aca': ReservasAca.fromJson(json),
                    'Reservas_NAca': ReservasNAca.fromJson(json),
                  });

      final ReservasAca? reservasAca = response['Reservas_Aca'] as ReservasAca?;
      final ReservasNAca? reservasNAca =
          response['Reservas_NAca'] as ReservasNAca?;

      if (reservasAca != null) {
        _reservasAca.clear();
        _reservasAca.addAll(reservasAca.reservasAca);
        reservasAcaSink(_reservasAca);
      }

      if (reservasNAca != null) {
        _reservasNAca.clear();
        _reservasNAca.addAll(reservasNAca.reservasNAca);
        reservasNAcaSink(_reservasNAca);
      }

      _combinedReservasStreamController.sink.add(_reservasAca + _reservasNAca);

      return response;
    } catch (e) {
      log('Error fetching reservas: $e');
      rethrow;
    }
  }

  // Peticiones
  Future<Map<String, dynamic>> getHistorial(BuildContext context) async {
    try {
      final response =
          await ApiService.fetchPatch<Map<String, dynamic>>(context,
              url: "https://www.sire.software/admin/reservas_apro",
              method: 'get',
              fromJson: (json) => {
                    'Reservas_Aca': ReservasAca.fromJson(json),
                    'Reservas_NAca': ReservasNAca.fromJson(json),
                  });

      final ReservasAca? reservasAca = response['Reservas_Aca'] as ReservasAca?;
      final ReservasNAca? reservasNAca =
          response['Reservas_NAca'] as ReservasNAca?;

      if (reservasAca != null) {
        _reservasAca.clear();
        _reservasAca.addAll(reservasAca.reservasAca);
        reservasAcaSink(_reservasAca);
      }

      if (reservasNAca != null) {
        _reservasNAca.clear();
        _reservasNAca.addAll(reservasNAca.reservasNAca);
        reservasNAcaSink(_reservasNAca);
      }

      _combinedReservasStreamController.sink.add(_reservasAca + _reservasNAca);

      return response;
    } catch (e) {
      log('Error fetching reservas: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> postCambiarEstado(
      BuildContext context, String reservaId, String estado) async {
    final url = 'https://www.sire.software/admin/cambiar_estado/$reservaId';
    final body = {'Estado': estado};

    try {
      final responseList = await ApiService.fetchPatch<dynamic>(
        context,
        url: url,
        method: 'PATCH',
        body: body,
        fromJson: (json) => json,
      );
      return responseList;
    } catch (e) {
      log('Error updating reserva estado: $e');
      rethrow;
    }
  }

  // Método para aprobar una reserva
  Future<Object> aprobarReservaAdmin(
      BuildContext context, String reservaId) async {
    final response = await postCambiarEstado(context, reservaId, 'Aprobada');
    return response;
  }

  // Método para rechazar una reserva
  Future<Object> rechazarReservaAdmin(
      BuildContext context, String reservaId) async {
    final response = await postCambiarEstado(context, reservaId, 'Rechazada');
    return response;
  }
}
