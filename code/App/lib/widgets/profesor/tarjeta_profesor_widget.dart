import 'package:flutter/material.dart';
import 'package:uloginazure/models/profesor_model.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';

class TarjetaProfesor extends StatelessWidget {
  const TarjetaProfesor({super.key, required this.profesor});

  final Profesor profesor;

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
              padding: const EdgeInsets.all(8.0),
              width: 130.0,
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
                          icon: const Icon(Icons.location_city),
                          onPressed: () {},
                          iconSize: 15.0,
                          color: colorLetras,
                        ),
                      ),
                      const SizedBox(height: 10.0),
                      Text(
                        extractTextAfterED(profesor.aula),
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 10.0),
                      ),
                    ],
                  ),
                  const SizedBox(height: 7.0),
                  Text(
                    profesor.estado,
                    style: const TextStyle(fontSize: 11.0),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 7.0),
                  Text(
                    profesor.materia,
                    style: const TextStyle(fontSize: 10.0),
                  ),
                  const SizedBox(height: 7.0),
                  Text(
                    profesor.estudiante,
                    style: const TextStyle(fontSize: 12.0),
                    overflow: TextOverflow.ellipsis,
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
