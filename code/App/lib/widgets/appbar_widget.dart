import 'package:flutter/material.dart';
import 'package:uloginazure/utils/colores_util.dart';

class AppBarWidget extends StatelessWidget implements PreferredSizeWidget {
  final String textoAppBar;

  const AppBarWidget({super.key, required this.textoAppBar});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: barColor,
      centerTitle: true,
      title: Text(
        textoAppBar,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20.0),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
