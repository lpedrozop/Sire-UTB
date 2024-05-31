import 'package:flutter/material.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/iniciales_util.dart';

class AppbarPrincipal extends StatelessWidget implements PreferredSizeWidget {
  final Map<String, dynamic> userData;

  const AppbarPrincipal({
    super.key,
    required this.userData,
  });

  @override
  Widget build(BuildContext context) {
    const estiloBienvenida = TextStyle(
        fontSize: 14.0, fontWeight: FontWeight.bold, color: colorBeige);

    const estiloNombre = TextStyle(
        fontSize: 16.0, fontWeight: FontWeight.bold, color: colorBlanco);

    final displayName = userData['name'] ?? '';
    final iniciales = obtenerIniciales(displayName);

    double ancho = MediaQuery.of(context).size.width;

    return AppBar(
      backgroundColor: primaryColor,
      toolbarHeight: 60.0,
      leading: SafeArea(
        child: Row(
          children: [
            const Spacer(),
            ClipRRect(
              borderRadius: BorderRadius.circular(25.0),
              child: Container(
                padding: const EdgeInsets.all(8.0),
                height: 40,
                width: 40,
                color: colorBlanco,
                child: Center(
                  child: Text(
                    iniciales,
                    style: const TextStyle(
                      color: primaryColor,
                      fontSize: 12.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
            const Spacer(),
          ],
        ),
      ),
      title: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Hola,",
              style: estiloBienvenida,
            ),
            Text(
              displayName,
              style: estiloNombre,
            )
          ],
        ),
      ),
      actions: [
        SafeArea(
          child: Container(
            margin: const EdgeInsets.only(right: 10.0),
            height: 38.0,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: primaryColor,
            ),
            child: IconButton(
              icon: Icon(
                Icons.notifications_outlined,
                size: ancho * 0.07,
              ),
              onPressed: () {},
              color: colorBlanco,
            ),
          ),
        )
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
