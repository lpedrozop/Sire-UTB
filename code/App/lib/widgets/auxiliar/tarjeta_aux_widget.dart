import 'package:flutter/material.dart';
import 'package:uloginazure/models/aux_model.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';

class TarjetaAux extends StatelessWidget {
  final Reserva reserva;

  const TarjetaAux({super.key, required this.reserva});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 10.0),
      width: 150.0,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(5.0),
        child: Container(
          padding: const EdgeInsets.all(8.0),
          decoration: const BoxDecoration(
            color: colorBlanco,
            boxShadow: [
              BoxShadow(
                color: Colors.red,
                blurRadius: 4,
                offset: Offset(0, 2),
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
                      icon: const Icon(Icons.location_city),
                      onPressed: () {},
                      iconSize: 15.0,
                      color: colorLetras,
                    ),
                  ),
                  const SizedBox(width: 14.0),
                  Text(
                    extractTextAfterED(reserva.idEspacio),
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 12.0),
                  ),
                ],
              ),
              const SizedBox(height: 7.0),
              Text(
                reserva.idUser,
                style: const TextStyle(fontSize: 11.0),
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 7.0),
              Text(
                reserva.nombre,
                style: const TextStyle(fontSize: 12.0),
              ),
              const SizedBox(height: 7.0),
              Text(
                parseDateTime(reserva.fechaInicio),
                style: const TextStyle(fontSize: 12.0),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
