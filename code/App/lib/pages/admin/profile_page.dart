import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/info_aux_model.dart';
import 'package:uloginazure/pages/admin/navigation_page.dart';
import 'package:uloginazure/providers/admin_aux_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/widgets/appbar_widget.dart';
import 'package:uloginazure/widgets/aux_profile_widget.dart';
import 'package:uloginazure/widgets/vacio_widget.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final AdminAuxProvider _adminAuxProvider = AdminAuxProvider();

  @override
  void initState() {
    super.initState();
    _adminAuxProvider.getListAsignaciones(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarWidget(textoAppBar: "Asignar"),
      backgroundColor: barColor,
      body: Container(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: [
            _searchButton(context),
            const SizedBox(height: 20.0),
            Expanded(
              child: _usuarioItem(
                _adminAuxProvider.combinedAsignacionStream,
                _adminAuxProvider.usuariosStream,
              ),
            ),
          ],
        ),
      ),
    );
  }

  _searchButton(BuildContext context) {
    final TextEditingController idController = TextEditingController();
    final TextEditingController nombreController = TextEditingController();

    return ElevatedButton(
      onPressed: () {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Crear Auxiliar'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: idController,
                    decoration: const InputDecoration(
                      labelText: 'ID del Usuario',
                    ),
                  ),
                  TextField(
                    controller: nombreController,
                    decoration: const InputDecoration(
                      labelText: 'Nombre',
                    ),
                  ),
                ],
              ),
              actions: [
                ElevatedButton(
                  onPressed: () async {
                    final String idUser = idController.text;
                    final String nombre = nombreController.text;

                    if (idUser.isNotEmpty && nombre.isNotEmpty) {
                      try {
                        await _adminAuxProvider.postCrearAux(
                            context, idUser, nombre);

                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                                '$nombre ha sido creado como nuevo auxiliar'),
                          ),
                        );

                        await Future.delayed(
                            const Duration(milliseconds: 1200));

                        Navigator.of(context).pop();
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const NavigationPage()),
                        );
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Error al crear el auxiliar: $e'),
                          ),
                        );
                      }
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Por favor complete todos los campos'),
                        ),
                      );
                    }
                  },
                  child: const Text('Crear Auxiliar'),
                )
              ],
            );
          },
        );
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(7.0),
        ),
      ),
      child: const Text(
        'Crear Auxiliar',
        style: TextStyle(color: colorBlanco),
      ),
    );
  }

  _usuarioItem(Stream<List<Asignacion>> asignacionStream,
      Stream<List<Usuario>> usuarioStream) {
    return StreamBuilder<List<Usuario>>(
      stream: usuarioStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: MediaQuery.of(context).size.height * 0.7,
            child: const Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          final List<Usuario> usuarios = snapshot.data ?? [];
          if (usuarios.isEmpty) {
            return const VacioWidget();
          } else {
            return ListView.builder(
              scrollDirection: Axis.vertical,
              itemCount: usuarios.length,
              itemBuilder: (BuildContext context, int index) {
                final usuario = usuarios[index];
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10.0),
                    GestureDetector(
                      child: ProfileAux(
                        usuario: usuario,
                        adminAuxProvider: _adminAuxProvider,
                      ),
                      onTap: () {},
                    ),
                    const SizedBox(height: 10.0),
                    const Divider(height: 2.0),
                  ],
                );
              },
            );
          }
        }
      },
    );
  }
}
