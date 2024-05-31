import 'package:flutter/material.dart';
import 'package:uloginazure/pages/admin/navigation_page.dart';
import 'package:uloginazure/pages/app.dart';
import 'pages/login/login_page.dart';
import 'models/auth_storage_model.dart';
import 'models/auth_service_model.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  String? token = await AuthStorage.getToken('GraphToken');
  bool tokenValid =
      token != null ? await AuthService.isTokenValid(token) : false;
  Widget initialPage = tokenValid ? const NavigationPage() : const LoginPage();
  runApp(MyApp(initialPage: initialPage));
}
