import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/list_reservas_model.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/widgets/lista_historial_widget.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  @override
  Widget build(BuildContext context) {
    final List<ReservaAdmin> eventos =
        ModalRoute.of(context)?.settings.arguments as List<ReservaAdmin>;
    return Scaffold(
      backgroundColor: barColor,
      appBar: _appBarEvent(context),
      body: _listaEventos(eventos),
    );
  }

  _appBarEvent(BuildContext context) {
    const estiloTitleEvent = TextStyle(
        fontSize: 18.0,
        fontWeight: FontWeight.bold,
        color: colorLetras,
        overflow: TextOverflow.ellipsis);
    return AppBar(
      title: const Text(
        "Historial de reservas",
        style: estiloTitleEvent,
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

  _listaEventos(List<ReservaAdmin> eventos) {
    return Container(
      padding: const EdgeInsets.all(15.0),
      child: ListView.builder(
        scrollDirection: Axis.vertical,
        itemCount: eventos.length,
        itemBuilder: (BuildContext context, int index) {
          return ListaHistorial(historial: [eventos[index]]);
        },
      ),
    );
  }
}
