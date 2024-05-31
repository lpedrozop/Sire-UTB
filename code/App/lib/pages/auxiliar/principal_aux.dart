import 'package:flutter/material.dart';
import 'package:uloginazure/models/aux_model.dart';
import 'package:uloginazure/providers/aux_provider.dart';
import 'package:uloginazure/providers/user_info_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/widgets/auxiliar/clases_aux_widget.dart';
import 'package:uloginazure/widgets/auxiliar/tarjeta_aux_widget.dart';
import 'package:uloginazure/widgets/principal_appbar_widget.dart';
import 'package:uloginazure/widgets/vacio_widget.dart';

class PrincipalAux extends StatefulWidget {
  final List<Auxiliar> auxReservas;
  const PrincipalAux({super.key, required this.auxReservas});

  @override
  State<PrincipalAux> createState() => _PrincipalAuxState();
}

class _PrincipalAuxState extends State<PrincipalAux> {
  final UserProfileProvider _userProfileProvider = UserProfileProvider.instance;
  final AuxProvider _auxProvider = AuxProvider();

  final _pageController = PageController(
    initialPage: 0,
    viewportFraction: 0.7,
  );
  final _pageControllerClases = PageController(
    initialPage: 0,
    viewportFraction: 0.95,
  );

  @override
  void initState() {
    super.initState();
    _auxProvider.getReservasAux(context);
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
            _cntAux(context),
          ],
        ),
      ),
    );
  }

  _cntAux(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15.0),
      margin: const EdgeInsets.only(top: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Reservas",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18.0,
              color: colorLetras,
            ),
          ),
          const SizedBox(height: 15.0),
          _builderAux(_auxProvider.auxiliarStream),
          const SizedBox(height: 15.0),
          const Text(
            "Clases Regulares",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18.0,
              color: colorLetras,
            ),
          ),
          const SizedBox(height: 15.0),
          _builderClases(_auxProvider.auxiliarStream),
        ],
      ),
    );
  }

  _builderAux(Stream<List<Auxiliar>> aStream) {
    return StreamBuilder<List<Auxiliar>>(
      stream: aStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: MediaQuery.of(context).size.height * 0.2,
            child: const Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError) {
          return Center(child: Text('StreamBuilder: Error: ${snapshot.error}'));
        } else {
          final List<Auxiliar> auxiliarList = snapshot.data ?? [];
          if (auxiliarList.first.reservas.isEmpty) {
            return const VacioWidget();
          } else {
            final List<Reserva> todasLasReservas =
                auxiliarList.expand((aux) => aux.reservas).toList();
            final screenSize = MediaQuery.of(context).size;
            return SizedBox(
              height: screenSize.height * 0.22,
              child: PageView.builder(
                controller: _pageController,
                itemCount: todasLasReservas.length,
                itemBuilder: (BuildContext context, index) {
                  final Reserva reserva = todasLasReservas[index];
                  return GestureDetector(
                    child: TarjetaAux(reserva: reserva),
                    onTap: () {
                      Navigator.pushNamed(context, 'aux/reporte',
                          arguments: reserva);
                    },
                  );
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

  Widget _builderClases(Stream<List<Auxiliar>> aStream) {
    return StreamBuilder<List<Auxiliar>>(
      stream: aStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: MediaQuery.of(context).size.height * 0.35,
            child: const Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError) {
          return Center(child: Text('StreamBuilder: Error: ${snapshot.error}'));
        } else {
          final List<Auxiliar> auxiliarList = snapshot.data ?? [];
          if (auxiliarList.first.clasesRegulares.isEmpty) {
            return SizedBox(
              height: MediaQuery.of(context).size.height * 0.35,
              child: const VacioWidget(),
            );
          } else {
            final List<ClaseRegular> clasesRegulares =
                auxiliarList.expand((aux) => aux.clasesRegulares).toList();
            final screenSize = MediaQuery.of(context).size;
            return SizedBox(
              height: screenSize.height * 0.35,
              child: PageView.builder(
                controller: _pageControllerClases,
                itemCount: clasesRegulares.length,
                itemBuilder: (BuildContext context, int index) {
                  final ClaseRegular clase = clasesRegulares[index];
                  return ClasesAux(clase: clase);
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
}
