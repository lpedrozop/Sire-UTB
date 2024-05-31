import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/list_reservas_model.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';

class ListaHistorial extends StatelessWidget {
  final List<ReservaAdmin> historial;
  const ListaHistorial({super.key, required this.historial});

  @override
  Widget build(BuildContext context) {
    const textStyleTitle = TextStyle(
      fontSize: 13.0,
      fontWeight: FontWeight.bold,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: historial.map((reserva) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              reserva.nombre,
              style: textStyleTitle,
            ),
            Text(
              extractTextAfterED(reserva.espacio),
              style: const TextStyle(fontSize: 11.0),
            ),
            const SizedBox(height: 5.0),
            const Divider(
              height: 2.0,
              color: colorGris,
            ),
            const SizedBox(height: 10.0),
          ],
        );
      }).toList(),
    );
  }
}
