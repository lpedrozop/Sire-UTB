import 'package:flutter/material.dart';
import 'package:uloginazure/models/admin/info_aux_model.dart';
import 'package:uloginazure/pages/admin/navigation_page.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/providers/admin_aux_provider.dart';

class ProfileAux extends StatelessWidget {
  final Usuario usuario;
  final AdminAuxProvider adminAuxProvider;

  const ProfileAux(
      {super.key, required this.usuario, required this.adminAuxProvider});

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(usuario.idUser),
      direction: DismissDirection.endToStart,
      onDismissed: (direction) async {
        try {
          await adminAuxProvider.postEliminarAux(context, usuario.idUser);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('${usuario.nombre} ha sido eliminado')),
          );
          await Future.delayed(const Duration(milliseconds: 1200));
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const NavigationPage()),
          );
        } catch (e) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error al eliminar ${usuario.nombre}')),
          );
        }
      },
      background: Container(
        color: colorRojo,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      child: InkWell(
        onTap: () {},
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(30.0),
                  child: Container(
                    width: 50.0,
                    height: 50.0,
                    color: colorVerde,
                    child: Center(
                      child: Text(
                        usuario.nombre.substring(0, 1),
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18.0,
                          color: colorBlanco,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10.0),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: 180.0,
                      child: Text(
                        usuario.nombre,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 3.0),
                    Text(
                      usuario.estado,
                      style: const TextStyle(
                        color: colorGris,
                        fontSize: 12.0,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
