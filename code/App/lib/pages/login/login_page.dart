import 'package:flutter/material.dart';
import 'package:uloginazure/utils/colores_util.dart';
import '../../models/auth_service_model.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          _fondoLogin(),
          _contentLogin(context),
        ],
      ),
    );
  }

  _fondoLogin() {
    return Stack(
      children: [
        Container(
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/fondo-2.png"),
              fit: BoxFit.cover,
            ),
          ),
        )
      ],
    );
  }

  _contentLogin(BuildContext context) {
    return SafeArea(
      child: SizedBox(
        width: double.infinity,
        child: Column(
          children: [
            const Padding(
              padding: EdgeInsets.only(top: 20.0),
              child: Image(
                image: AssetImage("assets/logo-sire.png"),
                width: 160.0,
              ),
            ),
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.52,
            ),
            const Padding(
              padding: EdgeInsets.all(20.0),
              child: SizedBox(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'El sistema de reservas de la UTB que facilita la gestión de espacios y recursos para la comunidad universitaria.',
                      style: TextStyle(
                        fontSize: 14,
                        color: colorBlanco,
                      ),
                      textAlign: TextAlign.justify,
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 32.0, vertical: 16.0),
              child: Column(
                children: [
                  ElevatedButton(
                    onPressed: _loading
                        ? null
                        : () async {
                            setState(() {
                              _loading = true;
                            });
                            String result = await AuthService.acquireToken();
                            setState(() {
                              _loading = false;
                            });
                            if (result.isNotEmpty) {
                              Navigator.pushReplacementNamed(
                                  context, 'initial');
                            } else {}
                          },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          vertical: 12, horizontal: 35),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6.0),
                      ),
                    ),
                    child: _loading
                        ? const CircularProgressIndicator()
                        : const Text(
                            'Iniciar Sesión',
                            style: TextStyle(
                              fontSize: 16.0,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
