import 'package:flutter/material.dart';
import 'package:uloginazure/models/profesor_model.dart';
import 'package:uloginazure/pages/profesores/home_prf_page.dart';
import 'package:uloginazure/providers/profesor_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/widgets/input_widget.dart';

class ReservaProfesor extends StatefulWidget {
  const ReservaProfesor({super.key});

  @override
  State<ReservaProfesor> createState() => _ReservaProfesorState();
}

class _ReservaProfesorState extends State<ReservaProfesor> {
  final profesorProvider = ProfesorProvider();
  @override
  Widget build(BuildContext context) {
    final Profesor profesor =
        ModalRoute.of(context)?.settings.arguments as Profesor;
    return Scaffold(
      backgroundColor: barColor,
      appBar: _appBarEvent(context, profesor),
      body: _containerInfoEvent(context, profesor),
    );
  }

  _appBarEvent(BuildContext context, Profesor profesor) {
    const estiloTitleEvent = TextStyle(
        fontSize: 18.0,
        fontWeight: FontWeight.bold,
        color: colorLetras,
        overflow: TextOverflow.ellipsis);
    return AppBar(
      title: const Text(
        "Reserva",
        style: estiloTitleEvent,
        overflow: TextOverflow.ellipsis,
      ),
      backgroundColor: barColor,
      centerTitle: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios),
        iconSize: 20.0,
        color: colorLetras,
        onPressed: () {
          Navigator.pop(context);
        },
      ),
    );
  }

  _containerInfoEvent(BuildContext context, Profesor profesor) {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: [
            _camposReserva(profesor),
            _campoDescripcion(profesor),
            _botonesAccion(context, profesor),
          ],
        ),
      ),
    );
  }

  _camposReserva(Profesor profesor) {
    return Column(
      children: [
        InputLabel(contenidoCampo: profesor.estudiante, label: "Nombre"),
        InputLabel(contenidoCampo: profesor.materia, label: "Materia"),
        InputLabel(contenidoCampo: profesor.aula, label: "Aula"),
      ],
    );
  }

  _campoDescripcion(Profesor profesor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Asunto de la reserva",
          overflow: TextOverflow.ellipsis,
          style: TextStyle(fontWeight: FontWeight.bold, color: colorLetras),
        ),
        const SizedBox(height: 7.0),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            color: colorBlanco,
            borderRadius: BorderRadius.circular(10.0),
          ),
          child: TextFormField(
            initialValue: profesor.motivo,
            maxLines: null,
            enabled: false,
            style: const TextStyle(
                fontSize: 15.0,
                fontWeight: FontWeight.normal,
                color: colorLetras),
            decoration: const InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.zero,
              isDense: true,
            ),
          ),
        ),
        const SizedBox(height: 15.0),
      ],
    );
  }

  _botonesAccion(BuildContext context, Profesor profesor) {
    const estiloLetras = TextStyle(
        fontSize: 16.0, fontWeight: FontWeight.w500, color: colorBlanco);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        ElevatedButton(
          onPressed: () async {
            try {
              final response = await profesorProvider.aprobarReserva(
                  context, profesor.idReserva);

              final Map<String, dynamic>? responseData =
                  response as Map<String, dynamic>?;

              if (responseData != null && responseData.containsKey('message')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(responseData['message']),
                    duration: const Duration(milliseconds: 1500),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Reserva aprobada con éxito'),
                    duration: Duration(milliseconds: 1500),
                  ),
                );
              }

              await Future.delayed(const Duration(milliseconds: 1000));

              Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => const HomePrf()));
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Error al aprobar la reserva'),
                  duration: Duration(seconds: 3),
                ),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: primaryColor,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(7.0),
            ),
          ),
          child: const Text(
            "Aprobar",
            style: estiloLetras,
          ),
        ),
        ElevatedButton(
          onPressed: () async {
            try {
              final response = await profesorProvider.rechazarReserva(
                  context, profesor.idReserva);

              final Map<String, dynamic>? responseData =
                  response as Map<String, dynamic>?;

              if (responseData != null && responseData.containsKey('message')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(responseData['message']),
                    duration: const Duration(milliseconds: 1500),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Reserva rechazada con éxito'),
                    duration: Duration(milliseconds: 1500),
                  ),
                );
              }

              await Future.delayed(const Duration(milliseconds: 600));

              Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => const HomePrf()));
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Error al aprobar la reserva'),
                  duration: Duration(seconds: 3),
                ),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: colorRojo,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(7.0),
            ),
          ),
          child: const Text(
            "Rechazar",
            style: estiloLetras,
          ),
        ),
      ],
    );
  }
}
