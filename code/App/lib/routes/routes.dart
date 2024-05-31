import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:uloginazure/pages/admin/asignar_aux_page.dart';
import 'package:uloginazure/pages/admin/contactanos_settings.dart';
import 'package:uloginazure/pages/admin/event_page.dart';
import 'package:uloginazure/pages/admin/history_page.dart';
import 'package:uloginazure/pages/admin/home_page.dart';
import 'package:uloginazure/pages/auxiliar/reporte_aux_page.dart';
import 'package:uloginazure/pages/profesores/reserva_page.dart';
import 'package:uloginazure/routes/inital_route.dart';
import 'package:uloginazure/pages/admin/navigation_page.dart';
import 'package:uloginazure/pages/admin/settings_page.dart';
import 'package:uloginazure/pages/auxiliar/home_aux_page.dart';
import 'package:uloginazure/pages/estudiantes/home_est_page.dart';
import 'package:uloginazure/pages/login/login_page.dart';
import 'package:uloginazure/pages/profesores/home_prf_page.dart';

Map<String, WidgetBuilder> getRoutes() {
  return <String, WidgetBuilder>{
    //Admin
    'initial': (context) => const InitialRoute(),
    'home': (context) => const HomePage(),
    'event': (context) => const EventPage(),
    'history': (context) => const HistoryPage(),
    'navigation': (context) => const NavigationPage(),
    'settings': (context) => const SettingsPage(),
    'contacto': (context) => const ContactoPage(),
    'login': (context) => const LoginPage(),
    'aux-assign': (context) => const AsignarAux(),

    //Estudiantes
    'estudiantes': (context) => const HomeEst(),

    //Profesores
    'profesores': (context) => const HomePrf(),
    'profesores/accion': (context) => const ReservaProfesor(),

    //Auxiliares
    'aux': (context) => const HomeAux(),
    'aux/reporte': (context) => const ReporteAux(),
  };
}
