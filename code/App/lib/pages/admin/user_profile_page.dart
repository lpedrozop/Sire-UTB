import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:uloginazure/models/api_services_model.dart';
import 'package:uloginazure/models/auth_service_model.dart';
import 'package:uloginazure/models/auth_storage_model.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({super.key});

  @override
  _UserProfilePageState createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  Map<String, dynamic> userData = {};

  @override
  void initState() {
    super.initState();
    fetchUserProfile();
  }

  Future<void> fetchUserProfile() async {
    String? token = await AuthStorage.getToken('GraphToken');
    if (token == null) {
      Navigator.pushReplacementNamed(context, '/login');
      return;
    }

    bool tokenValid = await AuthService.isTokenValid(token);
    if (!tokenValid) {
      // El token ha expirado, redirigir al usuario a la página de inicio de sesión
      // Elimina el token almacenado
      await AuthStorage.deleteToken('GraphToken');
      // Elimina los datos del perfil del usuario
      await AuthStorage.deleteUserProfile();
      // Redirigue al usuario a la página de inicio
      Navigator.pushReplacementNamed(context, '/login');
      return;
    }

    // Intenta obtener el perfil del usuario desde el almacenamiento local
    Map<String, dynamic>? savedUserData = await AuthStorage.getUserProfile();
    if (savedUserData != null) {
      setState(() {
        userData = savedUserData;
      });
      return;
    }

    // Si no hay datos guardados, obtiene el perfil del usuario desde la API
    try {
      final userProfile =
          await ApiService.fetchUserProfile(token as BuildContext);
      setState(() {
        userData = userProfile;
      });
      // Guarda los datos del perfil en el almacenamiento local
      await AuthStorage.saveUserProfile(userProfile);
    } catch (e) {
      log('Error fetching user profile: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Profile'),
      ),
      body: Center(
        child: userData.isNotEmpty
            ? Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    UserProfileField(
                      label: 'Display Name',
                      value: userData['displayName'] ?? '',
                      icon: Icons.person,
                    ),
                    UserProfileField(
                      label: 'Given Name',
                      value: userData['givenName'] ?? '',
                      icon: Icons.person,
                    ),
                    UserProfileField(
                      label: 'Job Title',
                      value: userData['jobTitle'] ?? '',
                      icon: Icons.work,
                    ),
                    UserProfileField(
                      label: 'Surname',
                      value: userData['surname'] ?? '',
                      icon: Icons.person,
                    ),
                    UserProfileField(
                      label: 'User Principal Name',
                      value: userData['userPrincipalName'] ?? '',
                      icon: Icons.email,
                    ),
                    UserProfileField(
                      label: 'ID',
                      value: userData['id'] ?? '',
                      icon: Icons.info,
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () async {
                        // Realiza el logout llamando al método correspondiente en AuthService
                        String logoutResult = await AuthService.logout();
                        if (logoutResult == "Account removed") {
                          // Si el logout tiene éxito, elimina el token y los datos del perfil del usuario
                          await AuthStorage.deleteToken('GraphToken');
                          await AuthStorage.deleteUserProfile();
                          // Redirige al usuario a la página de inicio
                          Navigator.pushReplacementNamed(context, '/login');
                        } else {
                          // Si hay un error en el logout, muestra un mensaje de error
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text(logoutResult),
                            duration: const Duration(seconds: 3),
                          ));
                        }
                      },
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              )
            : const CircularProgressIndicator(),
      ),
    );
  }
}

// Widget reutilizable para mostrar un campo del perfil de usuario
class UserProfileField extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const UserProfileField({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Icon(icon, size: 24),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(fontSize: 18),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
