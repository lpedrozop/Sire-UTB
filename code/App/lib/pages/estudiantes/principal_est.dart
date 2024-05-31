import 'package:flutter/material.dart';
import 'package:uloginazure/models/profesor_model.dart';
import 'package:uloginazure/providers/profesor_provider.dart';
import 'package:uloginazure/providers/user_info_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/widgets/estudiante/step_estudiante_widget.dart';
import 'package:uloginazure/widgets/principal_appbar_widget.dart';
import 'package:uloginazure/widgets/vacio_widget.dart';

class PrincipalEst extends StatefulWidget {
  final List<Aforo> aforo;
  const PrincipalEst({super.key, required this.aforo});

  @override
  State<PrincipalEst> createState() => _PrincipalEstState();
}

class _PrincipalEstState extends State<PrincipalEst> {
  final UserProfileProvider _userProfileProvider = UserProfileProvider.instance;
  final ProfesorProvider _profesorProvider = ProfesorProvider();

  @override
  void initState() {
    super.initState();
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
            _containerEstudiantesReservas(),
          ],
        ),
      ),
    );
  }

  _containerEstudiantesReservas() {
    return Container(
      padding: const EdgeInsets.all(15.0),
      margin: const EdgeInsets.only(top: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
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

  _reservasPendientes(Stream<List<Aforo>> aforoStream) {
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
            return SizedBox(
              height: MediaQuery.of(context).size.height * 0.6,
              child: const VacioWidget(),
            );
          } else {
            return Column(
              children: aforo
                  .where((aforo) => aforo.estado != "Finalizada")
                  .map((aforo) {
                return Container(
                  margin: const EdgeInsets.symmetric(vertical: 8.0),
                  child: StepEst(aforo),
                );
              }).toList(),
            );
          }
        }
      },
    );
  }
}
