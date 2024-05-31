import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/list_reservas_model.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';

class TarjetaEvento extends StatelessWidget {
  const TarjetaEvento({super.key, required this.reserva});

  final ReservaAdmin reserva;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 10.0),
      width: double.infinity,
      child: Column(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(5.0),
            child: Container(
              padding: const EdgeInsets.all(10.0),
              width: 190.0,
              height: 110.0,
              decoration: const BoxDecoration(
                color: colorBlanco,
                boxShadow: [
                  BoxShadow(
                    color: Colors.red,
                    blurRadius: 4,
                    offset: Offset(10.0, 2.5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        height: 30.0,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: cardColor,
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.event),
                          onPressed: () {},
                          iconSize: 15.0,
                          color: colorLetras,
                        ),
                      ),
                      const SizedBox(height: 10.0),
                      Text(
                        extractTextAfterED(reserva.espacio),
                        style: const TextStyle(fontSize: 12.0),
                      ),
                    ],
                  ),
                  const SizedBox(height: 7.0),
                  Text(
                    utilParseTime(reserva.fechaInicio),
                  ),
                  const SizedBox(height: 7.0),
                  Text(
                    reserva.nombre,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14.0,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
