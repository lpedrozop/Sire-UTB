import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/auth_service_model.dart';
import 'package:uloginazure/models/auth_storage_model.dart';
import 'package:uloginazure/pages/admin/navigation_page.dart';
import 'package:uloginazure/pages/auxiliar/home_aux_page.dart';
import 'package:uloginazure/pages/estudiantes/home_est_page.dart';
import 'package:uloginazure/pages/login/login_page.dart';
import 'package:uloginazure/pages/profesores/home_prf_page.dart';
import 'package:uloginazure/providers/user_info_provider.dart';

class InitialRoute extends StatefulWidget {
  const InitialRoute({super.key});

  @override
  _InitialRouteState createState() => _InitialRouteState();
}

class _InitialRouteState extends State<InitialRoute> {
  late String _userRole;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    try {
      await UserProfileProvider.instance.loadUserProfile(context);
      String? token = await AuthStorage.getToken('GraphToken');
      if (token == null || !(await AuthService.isTokenValid(token))) {
        _navigateToLoginPage();
      } else {
        if (UserProfileProvider.instance.userData.isNotEmpty) {
          _userRole = UserProfileProvider.instance.getUserRole ?? '';
          _navigateToHomePage(_userRole);
        }
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error loading user profile: $e');
      }
      _navigateToLoginPage();
    }
  }

  void _navigateToHomePage(String pageName) {
    switch (pageName) {
      case 'Administrador':
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const NavigationPage()),
        );
        break;
      case 'Aux_Administrativo':
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const HomeAux()),
        );
        break;
      case 'Profesor':
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const HomePrf()),
        );
        break;
      case 'Estudiante':
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const HomeEst()),
        );
        break;
      default:
        _navigateToLoginPage();
    }
  }

  void _navigateToLoginPage() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const LoginPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
