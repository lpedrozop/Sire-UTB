import 'package:flutter/material.dart';
import 'package:uloginazure/models/aux_model.dart';
import 'package:uloginazure/pages/auxiliar/home_aux_page.dart';
import 'package:uloginazure/providers/aux_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';
import 'package:uloginazure/widgets/input_widget.dart';

class ReporteAux extends StatefulWidget {
  const ReporteAux({super.key});

  @override
  State<ReporteAux> createState() => _ReporteAuxState();
}

class _ReporteAuxState extends State<ReporteAux> {
  final auxProvider = AuxProvider();
  @override
  Widget build(BuildContext context) {
    final Reserva reserva =
        ModalRoute.of(context)?.settings.arguments as Reserva;
    return Scaffold(
      backgroundColor: barColor,
      appBar: _appBarEvent(context, reserva),
      body: _containerInfoEvent(context, reserva),
    );
  }

  _appBarEvent(BuildContext context, Reserva reserva) {
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

  _containerInfoEvent(BuildContext context, Reserva reserva) {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _camposReserva(reserva),
            const Text(
              "Novedad: ",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.0),
            ),
            const SizedBox(height: 15.0),
            _botonesAccion(context, reserva),
          ],
        ),
      ),
    );
  }

  _camposReserva(Reserva reserva) {
    return Column(
      children: [
        InputLabel(contenidoCampo: reserva.nombre, label: "Nombre"),
        InputLabel(contenidoCampo: reserva.idUser, label: "Codigo"),
        InputLabel(contenidoCampo: reserva.idEspacio, label: "Aula"),
        InputLabel(
            contenidoCampo: parseDateTime(reserva.fechaInicio),
            label: "Fecha Inicio"),
      ],
    );
  }

  _botonesAccion(BuildContext context, Reserva reserva) {
    const estiloLetras = TextStyle(
        fontSize: 16.0, fontWeight: FontWeight.w500, color: colorBlanco);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (BuildContext context) {
                String descripcion = '';

                return AlertDialog(
                  title: const Text("Reporte"),
                  content: TextField(
                    onChanged: (value) {
                      descripcion = value;
                    },
                    decoration:
                        const InputDecoration(hintText: "¿Cual es su reporte?"),
                  ),
                  actions: [
                    ElevatedButton(
                      onPressed: () async {
                        try {
                          final response = await auxProvider.postReserva(
                              context, reserva.idReserva, 1,
                              descripcion: descripcion);

                          final Map<String, dynamic>? responseData =
                              response as Map<String, dynamic>?;

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(responseData?['Estado']),
                              duration: const Duration(milliseconds: 1800),
                            ),
                          );

                          await Future.delayed(
                              const Duration(milliseconds: 1800));
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const HomeAux()),
                          );
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Error al enviar reporte'),
                              duration: Duration(milliseconds: 1200),
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
                        "Enviar",
                        style: TextStyle(
                          color: colorBlanco,
                        ),
                      ),
                    ),
                  ],
                );
              },
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: colorRojo,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(7.0),
            ),
          ),
          child: const Text(
            "Si",
            style: estiloLetras,
          ),
        ),
        ElevatedButton(
          onPressed: () async {
            try {
              final response =
                  await auxProvider.postReserva(context, reserva.idReserva, 0);

              final Map<String, dynamic>? responseData =
                  response as Map<String, dynamic>?;

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(responseData?['Estado']),
                  duration: const Duration(milliseconds: 1200),
                ),
              );

              await Future.delayed(const Duration(milliseconds: 1000));

              Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => const HomeAux()));
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Error al enviar reporte'),
                  duration: Duration(milliseconds: 1200),
                ),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: colorVerde,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(7.0),
            ),
          ),
          child: const Text(
            "No",
            style: estiloLetras,
          ),
        ),
        ElevatedButton(
          onPressed: () async {
            String descripcion = 'No llego';
            try {
              final response = await auxProvider.postReserva(
                  context, reserva.idReserva, 1,
                  descripcion: descripcion);

              final Map<String, dynamic>? responseData =
                  response as Map<String, dynamic>?;

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(responseData?['Estado']),
                  duration: const Duration(milliseconds: 1200),
                ),
              );

              await Future.delayed(const Duration(milliseconds: 1000));

              Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => const HomeAux()));
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Error al enviar reporte'),
                  duration: Duration(milliseconds: 1200),
                ),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: colorAmarillo,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(7.0),
            ),
          ),
          child: const Text(
            "No llegó",
            style: estiloLetras,
          ),
        ),
      ],
    );
  }
}
