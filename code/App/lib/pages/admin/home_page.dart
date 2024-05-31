import 'dart:math';
import 'dart:core';
import 'package:flutter/material.dart';
import 'package:date_picker_timeline/date_picker_timeline.dart';
import 'package:uloginazure/models/admin/list_reservas_model.dart';
import 'package:uloginazure/providers/admin_reservas_provider.dart';
import 'package:uloginazure/providers/user_info_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fechas_util.dart';
import 'package:uloginazure/widgets/lista_historial_widget.dart';
import 'package:uloginazure/widgets/principal_appbar_widget.dart';
import 'package:uloginazure/widgets/tarjeta_widget.dart';
import 'package:uloginazure/widgets/vacio_widget.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final AdminReservasProvider _reservasProvider = AdminReservasProvider();
  final AdminReservasProvider _getHistorial = AdminReservasProvider();
  List<ReservaAdmin> reservasAca = [];
  List<ReservaAdmin> reservasNAca = [];
  List<ReservaAdmin> historialAca = [];
  List<ReservaAdmin> historialNAca = [];
  List<ReservaAdmin> historial = [];

  @override
  void initState() {
    super.initState();
    _cargarDatos();
    _userProfileProvider = UserProfileProvider.instance;
  }

  void _cargarDatos() async {
    final reservasResponse = await _reservasProvider.getReservasAdmin(context);
    final historialResponse = await _getHistorial.getHistorial(context);
    setState(() {
      reservasAca = reservasResponse['Reservas_Aca'].reservasAca;
      reservasNAca = reservasResponse['Reservas_NAca'].reservasNAca;
      historialAca = historialResponse['Reservas_Aca'].reservasAca;
      historialNAca = historialResponse['Reservas_NAca'].reservasNAca;
      historial = [...historialAca, ...historialNAca];
    });
  }

  @override
  void dispose() {
    _reservasProvider.dispose();
    _getHistorial.dispose();
    super.dispose();
  }

  DateTime _selectedDay = DateTime.now();

  final _pageController = PageController(
    initialPage: 0,
    viewportFraction: 0.8,
  );

  final _pageControllerList = PageController(
    initialPage: 0,
    viewportFraction: 0.2,
  );

  late UserProfileProvider _userProfileProvider;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppbarPrincipal(
        userData: _userProfileProvider.decodedToken,
      ),
      backgroundColor: barColor,
      body: SingleChildScrollView(
        child: Stack(
          children: [
            _colorFondoRedondeado(),
            Column(
              children: [
                const SizedBox(height: 10.0),
                _timelineCalendar(),
                const SizedBox(height: 10.0),
                _reservasContainer(context),
              ],
            ),
          ],
        ),
      ),
    );
  }

  _timelineCalendar() {
    return Container(
      padding: const EdgeInsets.all(8.0),
      child: DatePicker(
        DateTime.now(),
        height: 135.0,
        initialSelectedDate: DateTime.now(),
        selectionColor: colorBlanco,
        selectedTextColor: primaryColor,
        dayTextStyle: const TextStyle(
            color: colorBlanco, fontSize: 11.0, fontWeight: FontWeight.bold),
        monthTextStyle: const TextStyle(
            color: colorBlanco, fontSize: 11.0, fontWeight: FontWeight.bold),
        dateTextStyle: const TextStyle(
            color: colorBlanco, fontSize: 24.0, fontWeight: FontWeight.bold),
        locale: 'es_Es',
        onDateChange: (date) {
          setState(() {
            _selectedDay = date;
          });
        },
      ),
    );
  }

  _reservasContainer(BuildContext context) {
    String dayNow = getDay(_selectedDay);
    const tamanoDia = TextStyle(
        fontSize: 15.0, fontWeight: FontWeight.bold, color: colorLetras);

    const tamanoInkWell = TextStyle(
        fontSize: 12.0, fontWeight: FontWeight.normal, color: primaryColor);

    double ancho = MediaQuery.of(context).size.width;

    return Container(
      margin: const EdgeInsets.all(15.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Pendientes ${dayNow.toString()}",
                style: tamanoDia,
              ),
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.task),
                color: primaryColor,
                iconSize: ancho * 0.07,
              ),
            ],
          ),
          const SizedBox(height: 5.0),
          _infoReservas(context),
          const SizedBox(height: 20.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Historial ",
                style: tamanoDia,
              ),
              InkWell(
                onTap: () {
                  Navigator.pushNamed(context, 'history', arguments: historial);
                },
                child: const Text(
                  "Ver todos",
                  style: tamanoInkWell,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20.0),
          _listaHistorial(context),
        ],
      ),
    );
  }

  _infoReservas(BuildContext context) {
    return StreamBuilder<List<ReservaAdmin>>(
      stream: _reservasProvider.combinedReservasStream,
      builder: ((context, snapshot) {
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
          final List<ReservaAdmin> reservas = snapshot.data ?? [];
          if (reservas.isEmpty) {
            return const VacioWidget();
          } else {
            final reservasDelDia = reservas.where((reserva) {
              final reservaDateTime = DateTime.parse(reserva.fechaInicio);
              return reservaDateTime.day == _selectedDay.day &&
                  reservaDateTime.month == _selectedDay.month &&
                  reservaDateTime.year == _selectedDay.year;
            });

            if (reservasDelDia.isEmpty) {
              return const VacioWidget();
            } else {
              final screenSize = MediaQuery.of(context).size;
              return SizedBox(
                height: screenSize.height * 0.21,
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: reservasDelDia.length,
                  itemBuilder: (BuildContext context, index) {
                    return _eventoTarjeta(
                        context, reservasDelDia.elementAt(index));
                  },
                  physics: const BouncingScrollPhysics(),
                  padEnds: false,
                ),
              );
            }
          }
        }
      }),
    );
  }

  _eventoTarjeta(BuildContext context, ReservaAdmin reserva) {
    return GestureDetector(
      child: TarjetaEvento(reserva: reserva),
      onTap: () {
        Navigator.pushNamed(context, 'event', arguments: reserva);
      },
    );
  }

  _listaHistorial(BuildContext context) {
    return StreamBuilder<List<ReservaAdmin>>(
      stream: _getHistorial.combinedReservasStream,
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
          final List<ReservaAdmin> historial = snapshot.data ?? [];
          if (historial.isEmpty) {
            return const SizedBox(
              width: double.infinity,
              height: 270.0,
              child: VacioWidget(),
            );
          } else {
            final int maxItems = min(5, historial.length);
            return SizedBox(
              width: double.infinity,
              height: 270.0,
              child: PageView.builder(
                scrollDirection: Axis.vertical,
                controller: _pageControllerList,
                itemCount: maxItems,
                itemBuilder: (BuildContext context, int index) {
                  return ListaHistorial(historial: [historial[index]]);
                },
                padEnds: false,
              ),
            );
          }
        }
      },
    );
  }

  _colorFondoRedondeado() {
    return Positioned(
      top: -5,
      left: 0,
      right: 0,
      child: Container(
        width: double.infinity,
        height: 180.0,
        decoration: const BoxDecoration(
          color: primaryColor,
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(20.0),
            bottomRight: Radius.circular(20.0),
          ),
        ),
      ),
    );
  }
}
