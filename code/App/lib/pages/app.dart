import 'dart:async';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/auth_service_model.dart';
import 'package:uloginazure/models/auth_storage_model.dart';
import 'package:uloginazure/routes/inital_route.dart';
import 'package:uloginazure/pages/login/login_page.dart';
import 'package:uloginazure/routes/routes.dart';
import 'package:uloginazure/utils/helpers.dart';

class MyApp extends StatefulWidget {
  final Widget initialPage;

  const MyApp({super.key, required this.initialPage});

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late Timer _timer;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _startTokenRefreshTimer();
    _initialized = true;
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  void _startTokenRefreshTimer() {
    _timer = Timer.periodic(const Duration(minutes: 75), (timer) async {
      if (_initialized) {
        String? token = await AuthStorage.getToken('GraphToken');
        if (token != null) {
          bool tokenValid = await AuthService.isTokenValid(token);
          if (tokenValid) {
            await AuthService.acquireTokenSilently(
                ["api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso"]);
          } else {
            String logoutResult = await AuthService.logout();
            if (logoutResult == "Account removed") {
              await ApiServiceHelper.deleteAllTokens();
              Navigator.pushReplacementNamed(context, 'login');
            } else {
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text(logoutResult),
                duration: const Duration(seconds: 3),
              ));
            }
          }
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SiRe UTB',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color.fromRGBO(0, 103, 184, 1),
        ),
        useMaterial3: true,
      ),
      home: const InitialRoute(),
      routes: getRoutes(),
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case 'login':
            return MaterialPageRoute(builder: (context) => const LoginPage());
          case 'initial':
            return MaterialPageRoute(
                builder: (context) => const InitialRoute());
          default:
            // Si la ruta no se encuentra, regresa a página a una ruta predeterminada
            return MaterialPageRoute(builder: (context) => const LoginPage());
        }
      },
    );
  }
}
