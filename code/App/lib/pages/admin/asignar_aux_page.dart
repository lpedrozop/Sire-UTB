import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/info_aux_model.dart';
import 'package:uloginazure/providers/admin_aux_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/widgets/vacio_widget.dart';

class AsignarAux extends StatefulWidget {
  const AsignarAux({super.key});

  @override
  State<AsignarAux> createState() => _AsignarAuxState();
}

class _AsignarAuxState extends State<AsignarAux> {
  TimeOfDay selectedStartTime = TimeOfDay.now();
  TimeOfDay selectedEndTime = TimeOfDay.now();

  final AdminAuxProvider _adminAuxProvider = AdminAuxProvider();

  @override
  void initState() {
    super.initState();
    _adminAuxProvider.getListAsignaciones(context);
  }

  @override
  Widget build(BuildContext context) {
    final Usuario usuario =
        ModalRoute.of(context)?.settings.arguments as Usuario;

    return Scaffold(
      backgroundColor: barColor,
      appBar: AppBar(
        backgroundColor: barColor,
        centerTitle: true,
        title: const Text(
          "Perfil",
          style: TextStyle(
            fontSize: 18.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: Row(children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios),
            iconSize: 20.0,
            color: colorLetras,
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ]),
      ),
      body: _containerAuxAssign(context, usuario),
    );
  }

  _containerAuxAssign(BuildContext context, Usuario usuario) {
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: _profileContent(context, usuario),
        ),
        SliverFillRemaining(
          child: _infoAux(context, usuario.idUser),
        ),
      ],
    );
  }

  _profileContent(BuildContext context, Usuario usuario) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.28,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(30.0),
            child: Container(
              width: 60.0,
              height: 60.0,
              color: colorVerde,
              child: Center(
                child: Text(
                  usuario.nombre.substring(0, 2),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18.0,
                    color: colorBlanco,
                  ),
                ),
              ),
            ),
          ),
          Text(
            usuario.nombre,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: colorLetras,
              fontSize: 16.0,
            ),
          ),
          Text(
            usuario.idUser,
            style: const TextStyle(color: primaryColor),
          ),
          const Divider(
            height: 1.0,
            color: colorGris,
          ),
        ],
      ),
    );
  }

  _infoAux(BuildContext context, String userId) {
    const estiloNumeros = TextStyle(
        fontSize: 15.0, fontWeight: FontWeight.bold, color: colorLetras);

    return StreamBuilder<List<Usuario>>(
      stream: _adminAuxProvider.usuariosStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: MediaQuery.of(context).size.height * 0.3,
            child: const Center(
              child: CircularProgressIndicator(),
            ),
          );
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          final List<Usuario>? usuarios = snapshot.data;
          if (usuarios == null || usuarios.isEmpty) {
            return const VacioWidget();
          } else {
            final Usuario usuario = usuarios.firstWhere(
              (usuario) => usuario.idUser == userId,
              orElse: () =>
                  Usuario(idUser: '', nombre: '', estado: '', asignaciones: []),
            );

            if (usuario.asignaciones.isEmpty) {
              return const VacioWidget();
            }

            List<Widget> asignacionesWidgets = [];
            for (var asignacion in usuario.asignaciones) {
              asignacionesWidgets.add(
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Horario para ${asignacion.bloque}:',
                      style: estiloNumeros,
                    ),
                    for (var horario in asignacion.horarios)
                      Text(
                        '${horario.dia}: ${horario.horario}',
                        style: estiloNumeros,
                      ),
                    const Divider(),
                  ],
                ),
              );
            }

            return Column(
              children: asignacionesWidgets,
            );
          }
        }
      },
    );
  }
}
