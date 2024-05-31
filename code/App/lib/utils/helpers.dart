import 'dart:developer';

import 'package:flutter/material.dart';
import '../models/auth_service_model.dart';
import '../models/auth_storage_model.dart';

class ApiServiceHelper {
  static Future<String> getValidToken(
      String tokenKey, List<String> scopes, BuildContext context) async {
    try {
      String? token = await AuthStorage.getToken(tokenKey);

      if (token == null || !(await AuthService.isTokenValid(token))) {
        // Si no hay token guardado o el token existente no es válido, intenta adquirir uno nuevo
        token = await handleExpiredToken(tokenKey, scopes);
        if (token == null) {
          // Redirige al usuario a la página de inicio de sesión y borra todos los tokens si no se pudo adquirir uno nuevo
          await clearTokensAndRedirectToLogin(context);
        }
      }
      return token!;
    } catch (e) {
      throw Exception('Error al obtener el token: $e');
    }
  }

  static Future<String?> handleExpiredToken(
      String tokenKey, List<String> scopes) async {
    try {
      // Intentar adquirir un nuevo token de forma silenciosa
      String? token = await AuthService.acquireTokenSilently(scopes);
      if (token != null && token.isNotEmpty) {
        await AuthStorage.saveToken(token, tokenKey);
      } else {
        log("Token adquirido es nulo o vacío: $token");
        throw Exception('No se pudo adquirir un nuevo token');
      }
      return token;
    } catch (e) {
      log("Error al manejar el token expirado: $e");
      throw Exception('Error al manejar el token expirado: $e');
    }
  }

  static Future<void> clearTokensAndRedirectToLogin(
      BuildContext context) async {
    try {
      await deleteAllTokens();
      Navigator.pushReplacementNamed(context, 'login');
    } catch (e) {
      throw Exception('Error al borrar los tokens y redirigir al usuario: $e');
    }
  }

  static Future<void> deleteAllTokens() async {
    try {
      await AuthStorage.deleteToken('GraphToken');
      await AuthStorage.deleteToken('todoListToken');
      await AuthStorage.deleteUserProfile();
    } catch (e) {
      throw Exception('Error al borrar los tokens: $e');
    }
  }
}
