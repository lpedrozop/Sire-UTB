import 'package:flutter/material.dart';
import 'package:uloginazure/models/profesor_model.dart';
import 'package:uloginazure/pages/admin/settings_page.dart';
import 'package:uloginazure/pages/estudiantes/principal_est.dart';
import 'package:uloginazure/providers/profesor_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';

class HomeEst extends StatefulWidget {
  const HomeEst({super.key});

  @override
  State<HomeEst> createState() => _HomeEstState();
}

class _HomeEstState extends State<HomeEst> {
  int currentIndex = 0;
  late List<Aforo> aforo = [];

  @override
  void initState() {
    super.initState();
    _cargarDatos();
  }

  void _cargarDatos() async {
    aforo = await ProfesorProvider().getAforo(context);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: barColor,
      body: _cargarPage(currentIndex),
      bottomNavigationBar: _bottomNavigationbar(),
      floatingActionButton: _floatingActionEst(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  _cargarPage(int paginaActual) {
    switch (paginaActual) {
      case 0:
        return PrincipalEst(aforo: aforo);
      case 1:
        return PrincipalEst(aforo: aforo);
      case 2:
        return const SettingsPage();

      default:
        return PrincipalEst(aforo: aforo);
    }
  }

  _bottomNavigationbar() {
    double alto = MediaQuery.of(context).size.height;
    double ancho = MediaQuery.of(context).size.width;
    return SizedBox(
      height: alto * 0.07,
      child: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: currentIndex,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },
        items: [
          _iconosNavigation(Icons.home),
          const BottomNavigationBarItem(
            icon: SizedBox(
              width: 6.0,
            ),
            label: '',
          ),
          _iconosNavigation(Icons.settings),
        ],
        selectedIconTheme: IconThemeData(
          size: ancho * 0.08,
        ),
        unselectedIconTheme: IconThemeData(size: ancho * 0.08),
      ),
    );
  }

  _iconosNavigation(IconData icono) {
    return BottomNavigationBarItem(
      icon: SizedBox(
        height: 6.0,
        child: Icon(icono),
      ),
      label: '',
    );
  }

  _floatingActionEst() {
    return FloatingActionButton(
      onPressed: () {},
      backgroundColor: primaryColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(40.0),
      ),
      child: const Icon(
        Icons.add,
        color: colorBlanco,
        size: 25.0,
      ),
    );
  }
}
