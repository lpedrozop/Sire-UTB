import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/list_reservas_model.dart';
import 'package:uloginazure/pages/admin/home_page.dart';
import 'package:uloginazure/providers/admin_reservas_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';
import 'package:uloginazure/widgets/input_widget.dart';

class EventPage extends StatefulWidget {
  const EventPage({super.key});

  @override
  State<EventPage> createState() => _EventPageState();
}

class _EventPageState extends State<EventPage> {
  final adminReservaProvider = AdminReservasProvider();

  @override
  Widget build(BuildContext context) {
    final ReservaAdmin evento =
        ModalRoute.of(context)?.settings.arguments as ReservaAdmin;
    return Scaffold(
      backgroundColor: barColor,
      appBar: _appBarEvent(context, evento),
      body: _containerInfoEvent(context, evento),
    );
  }

  _appBarEvent(BuildContext context, ReservaAdmin evento) {
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

  _containerInfoEvent(BuildContext context, ReservaAdmin evento) {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: [
            _camposReserva(evento),
            _campoDescripcion(evento),
            _campoHorario(evento),
            _botonesAccion(context, evento),
          ],
        ),
      ),
    );
  }

  _camposReserva(ReservaAdmin evento) {
    return Column(
      children: [
        InputLabel(contenidoCampo: evento.nombre, label: "Nombre"),
        InputLabel(
            contenidoCampo: utilParseTime(evento.fechaInicio),
            label: "Fecha de inicio"),
        InputLabel(contenidoCampo: evento.espacio, label: "Aula"),
      ],
    );
  }

  _campoDescripcion(ReservaAdmin evento) {
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
            initialValue: evento.motivo,
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

  _campoHorario(ReservaAdmin evento) {
    const estiloHoras =
        TextStyle(fontWeight: FontWeight.bold, color: colorLetras);
    return SizedBox(
      width: double.infinity,
      height: 100.0,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Text(
                "Academico",
                style: estiloHoras,
              ),
              SizedBox(width: 80.0),
              Text(
                "Aforo",
                style: estiloHoras,
              ),
            ],
          ),
          const SizedBox(height: 10.0),
          Row(
            children: [
              Expanded(
                child: TextField(
                  readOnly: true,
                  decoration: InputDecoration(
                    enabledBorder: UnderlineInputBorder(
                      borderSide: const BorderSide(color: Colors.transparent),
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        vertical: 10.0, horizontal: 12.0),
                    hintText: evento.nombreDocente ?? "No aplica",
                    filled: true,
                    fillColor: colorBlanco,
                    hintStyle: const TextStyle(
                        color: colorLetras,
                        fontWeight: FontWeight.normal,
                        fontSize: 15.0),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextField(
                  readOnly: true,
                  decoration: InputDecoration(
                    enabledBorder: UnderlineInputBorder(
                      borderSide: const BorderSide(color: Colors.transparent),
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        vertical: 10.0, horizontal: 12.0),
                    hintText: evento.aforo.toString(),
                    filled: true,
                    fillColor: colorBlanco,
                    hintStyle: const TextStyle(
                        color: colorLetras,
                        fontWeight: FontWeight.normal,
                        fontSize: 15.0),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  _botonesAccion(BuildContext context, ReservaAdmin evento) {
    const estiloLetras = TextStyle(
        fontSize: 16.0, fontWeight: FontWeight.w500, color: colorBlanco);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        ElevatedButton(
          onPressed: () async {
            try {
              final response = await adminReservaProvider.aprobarReservaAdmin(
                  context, evento.idReserva);

              final Map<String, dynamic>? responseData =
                  response as Map<String, dynamic>?;

              if (responseData != null && responseData.containsKey('message')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(responseData['message']),
                    duration: const Duration(milliseconds: 800),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Reserva aprobada con éxito'),
                    duration: Duration(milliseconds: 800),
                  ),
                );
              }

              await Future.delayed(const Duration(milliseconds: 1000));

              Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => const HomePage()));
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Error al confirmar la reserva'),
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
            "Confirmar",
            style: estiloLetras,
          ),
        ),
        ElevatedButton(
          onPressed: () async {
            try {
              final response = await adminReservaProvider.rechazarReservaAdmin(
                  context, evento.idReserva);

              final Map<String, dynamic>? responseData =
                  response as Map<String, dynamic>?;

              if (responseData != null && responseData.containsKey('message')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(responseData['message']),
                    duration: const Duration(milliseconds: 800),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Reserva aprobada con éxito'),
                    duration: Duration(milliseconds: 800),
                  ),
                );
              }

              await Future.delayed(const Duration(milliseconds: 1000));

              Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => const HomePage()));
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Error al rechazar la reserva'),
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
