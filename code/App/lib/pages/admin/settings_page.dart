import 'package:flutter/material.dart';
import 'package:uloginazure/models/auth_service_model.dart';
import 'package:uloginazure/providers/user_info_provider.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/helpers.dart';
import 'package:uloginazure/widgets/appbar_widget.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: barColor,
      appBar: const AppBarWidget(textoAppBar: "Ajustes"),
      body: _contentSettings(context),
    );
  }

  _contentSettings(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: [
            _iconosSettings(context, Icons.mail, "Contactanos", "contacto"),
            const SizedBox(height: 20.0),
            _iconosSettings(context, Icons.language, "Idioma", "profile"),
            const SizedBox(height: 20.0),
            _botonSalir(context),
          ],
        ),
      ),
    );
  }

  _iconosSettings(BuildContext context, IconData iconoPrincipal,
      String textoIcono, String source) {
    return GestureDetector(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10.0),
        child: Container(
          width: double.infinity,
          height: 50.0,
          decoration: const BoxDecoration(
            color: colorBlanco,
          ),
          child: Container(
            margin: const EdgeInsetsDirectional.symmetric(horizontal: 15.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    SizedBox(
                      child: Row(
                        children: [
                          Icon(
                            iconoPrincipal,
                            size: 17.0,
                          ),
                          const SizedBox(
                            width: 10.0,
                          ),
                          Text(
                            textoIcono,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                    const Icon(
                      Icons.arrow_forward_ios,
                      size: 17.0,
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
      onTap: () {
        Navigator.pushNamed(context, source);
      },
    );
  }

  _botonSalir(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
        ),
        onPressed: () async {
          String logoutResult = await AuthService.logout();
          if (logoutResult == "Account removed") {
            await ApiServiceHelper.deleteAllTokens();
            UserProfileProvider.instance.clearUserProfile();
            Navigator.pushReplacementNamed(context, 'login');
          } else {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text(logoutResult),
              duration: const Duration(seconds: 3),
            ));
          }
        },
        child: const Text(
          "Cerrar Sesion",
          style: TextStyle(color: colorBlanco, fontSize: 15.0),
        ),
      ),
    );
  }
}
