import 'package:flutter/material.dart';
import 'package:uloginazure/models/profesor_model.dart';
import 'package:uloginazure/providers/profesor_provider.dart';
import 'package:uloginazure/providers/user_info_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/widgets/principal_appbar_widget.dart';
import 'package:uloginazure/widgets/profesor/step_aforo_widget.dart';
import 'package:uloginazure/widgets/profesor/tarjeta_profesor_widget.dart';
import 'package:uloginazure/widgets/vacio_widget.dart';

class PrincipalPrf extends StatefulWidget {
  final List<Profesor> reservas;
  final List<Aforo> aforo;

  const PrincipalPrf({super.key, required this.reservas, required this.aforo});

  @override
  State<PrincipalPrf> createState() => _PrincipalPrfState();
}

class _PrincipalPrfState extends State<PrincipalPrf> {
  final UserProfileProvider _userProfileProvider = UserProfileProvider.instance;
  final ProfesorProvider _profesorProvider = ProfesorProvider();

  final _pageController = PageController(
    initialPage: 0,
    viewportFraction: 0.6,
  );

  @override
  void initState() {
    super.initState();
    _profesorProvider.getReservasAprobar(context);
    _profesorProvider.getAforo(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: barColor,
      appBar: AppbarPrincipal(
        userData: _userProfileProvider.decodedToken,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _containerReservas(context),
          ],
        ),
      ),
    );
  }

  _containerReservas(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15.0),
      margin: const EdgeInsets.only(top: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Aprobar estudiantes",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18.0,
              color: colorLetras,
            ),
          ),
          const SizedBox(
            height: 12.0,
          ),
          _infoReservas(_profesorProvider.profesorStream),
          const SizedBox(
            height: 15.0,
          ),
          const Text(
            "Mis reservas",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18.0,
              color: colorLetras,
            ),
          ),
          const SizedBox(
            height: 10.0,
          ),
          _reservasPendientes(_profesorProvider.aforoStream),
        ],
      ),
    );
  }

  _infoReservas(Stream<List<Profesor>> reservasStream) {
    return StreamBuilder<List<Profesor>>(
      stream: reservasStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: MediaQuery.of(context).size.height * 0.3,
            child: const Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          final List<Profesor> reservas = snapshot.data ?? [];
          if (reservas.isEmpty) {
            return const VacioWidget();
          } else {
            final screenSize = MediaQuery.of(context).size;
            return SizedBox(
              height: screenSize.height * 0.22,
              child: PageView.builder(
                controller: _pageController,
                itemCount: reservas.length,
                itemBuilder: (BuildContext context, index) {
                  return _eventoTarjeta(context, reservas[index]);
                },
                physics: const BouncingScrollPhysics(),
                padEnds: false,
              ),
            );
          }
        }
      },
    );
  }

  _eventoTarjeta(BuildContext context, Profesor profesor) {
    return GestureDetector(
      child: TarjetaProfesor(profesor: profesor),
      onTap: () {
        Navigator.pushNamed(context, 'profesores/accion', arguments: profesor);
      },
    );
  }

  Widget _reservasPendientes(Stream<List<Aforo>> aforoStream) {
    return StreamBuilder<List<Aforo>>(
      stream: aforoStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: MediaQuery.of(context).size.height * 0.3,
            child: const Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          final List<Aforo> aforo = snapshot.data ?? [];
          if (aforo.isEmpty) {
            return const VacioWidget();
          } else {
            return Column(
              children: aforo
                  .where((aforo) => aforo.estado != "Finalizada")
                  .map((aforo) {
                return Container(
                  margin: const EdgeInsets.symmetric(vertical: 8.0),
                  child: StepsAforo(aforo),
                );
              }).toList(),
            );
          }
        }
      },
    );
  }
}
