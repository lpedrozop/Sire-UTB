import 'package:flutter/material.dart';
import 'package:uloginazure/models/aux_model.dart';
import 'package:uloginazure/pages/auxiliar/home_aux_page.dart';
import 'package:uloginazure/providers/aux_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';

class ClasesAux extends StatelessWidget {
  final ClaseRegular clase;

  const ClasesAux({super.key, required this.clase});

  ButtonStyle styleButton(Color color) {
    return ElevatedButton.styleFrom(
        backgroundColor: color,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(7.0),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 2.0));
  }

  @override
  Widget build(BuildContext context) {
    final auxProvider = AuxProvider();
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 5.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(5.0),
        boxShadow: [
          BoxShadow(
            color: colorGris.withOpacity(0.3),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
        color: colorBlanco,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 30.0,
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(5.0),
                topRight: Radius.circular(5.0),
              ),
              color: primaryColor,
            ),
            child: Center(
              child: Text(
                clase.horas,
                style: const TextStyle(
                  color: colorBlanco,
                  fontSize: 15.0,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
          const SizedBox(height: 10.0),
          Container(
            padding:
                const EdgeInsets.symmetric(vertical: 1.0, horizontal: 12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(clase.nombre),
                const SizedBox(height: 10.0),
                Text(extractTextAfterED(clase.idEspacio)),
                const SizedBox(height: 10.0),
                const Text(
                  "Novedad:",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
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
                                decoration: const InputDecoration(
                                    hintText: "¿Cual es su reporte?"),
                              ),
                              actions: [
                                ElevatedButton(
                                  onPressed: () async {
                                    try {
                                      final response =
                                          await auxProvider.postClase(
                                              context, clase.idHorario, 1,
                                              descripcion: descripcion);

                                      final Map<String, dynamic>? responseData =
                                          response as Map<String, dynamic>?;

                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        SnackBar(
                                          content:
                                              Text(responseData?['Estado']),
                                          duration: const Duration(
                                              milliseconds: 1800),
                                        ),
                                      );

                                      await Future.delayed(
                                          const Duration(milliseconds: 1800));
                                      Navigator.pushReplacement(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const HomeAux()),
                                      );
                                    } catch (e) {
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        const SnackBar(
                                          content:
                                              Text('Error al enviar reporte'),
                                          duration:
                                              Duration(milliseconds: 1200),
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
                      style: styleButton(colorRojo),
                      child: const Text(
                        "Si",
                        style: TextStyle(color: colorBlanco),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        try {
                          final response = await auxProvider.postClase(
                              context, clase.idHorario, 0);

                          final Map<String, dynamic>? responseData =
                              response as Map<String, dynamic>?;

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(responseData?['Estado']),
                              duration: const Duration(milliseconds: 1200),
                            ),
                          );

                          await Future.delayed(
                              const Duration(milliseconds: 1000));

                          Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const HomeAux()));
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Error al enviar reporte'),
                              duration: Duration(milliseconds: 1200),
                            ),
                          );
                        }
                      },
                      style: styleButton(colorVerde),
                      child: const Text(
                        "No",
                        style: TextStyle(color: colorBlanco),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        String descripcion = 'No llego';
                        try {
                          final response = await auxProvider.postClase(
                              context, clase.idHorario, 1,
                              descripcion: descripcion);

                          final Map<String, dynamic>? responseData =
                              response as Map<String, dynamic>?;

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(responseData?['Estado']),
                              duration: const Duration(milliseconds: 1200),
                            ),
                          );

                          await Future.delayed(
                              const Duration(milliseconds: 1000));

                          Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const HomeAux()));
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Error al enviar reporte'),
                              duration: Duration(milliseconds: 1200),
                            ),
                          );
                        }
                      },
                      style: styleButton(colorAmarillo),
                      child: const Text(
                        "No llegó",
                        style: TextStyle(color: colorBlanco),
                      ),
                    ),
                  ],
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
