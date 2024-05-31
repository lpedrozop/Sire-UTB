import 'dart:convert';
import 'dart:developer';
import 'package:azure_ad_authentication/azure_ad_authentication.dart';
import 'package:azure_ad_authentication/exeption.dart';
import 'package:azure_ad_authentication/model/user_ad.dart';
import 'dart:async';
import 'package:flutter/services.dart';
import 'auth_storage_model.dart';

class AuthService {
  static const String _authority =
      "https://login.microsoftonline.com/fc392005-78b3-4dc1-9257-ffbcff443b61/v2.0/authorize";
  static const String _redirectUri =
      "msauth://com.sire.uloginazure/iZsW88Tv9Q8xrgpgnmL1Pq0HpwM%3D";
  static const String _clientId = "82fb3fd0-776e-47e6-9527-5712cd89b6fe";
  static const List<String> _scopes = [
    "api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso"
  ];

  static Future<String> acquireToken() async {
    try {
      AzureAdAuthentication pca =
          await AzureAdAuthentication.createPublicClientApplication(
              clientId: _clientId, authority: _authority);

      UserAdModel? userAdModel = await pca.acquireToken(scopes: _scopes);
      String? token = userAdModel?.accessToken;

      await AuthStorage.saveToken(token!, 'GraphToken');
      log(token);
      return token;
    } on MsalUserCancelledException {
      return "User cancelled";
    } on MsalNoAccountException {
      return "No account found";
    } on MsalInvalidConfigurationException {
      return "Invalid MSAL configuration";
    } on MsalInvalidScopeException {
      return "Invalid scope";
    } on MsalException catch (e) {
      return "Error acquiring token: ${e.errorMessage}";
    } catch (e) {
      return "Unexpected error: $e";
    }
  }

  static Future<bool> verificarToken() async {
    String? token = await AuthStorage.getToken('GraphToken');
    return token != null;
  }

  static Future<String> logout() async {
    try {
      // Verificar si hay un token existente
      String? token = await AuthStorage.getToken('GraphToken');
      if (token != null) {
        // Si hay un token, crear la instancia de PCA y cerrar la sesión
        AzureAdAuthentication pca =
            await AzureAdAuthentication.createPublicClientApplication(
                clientId: _clientId,
                authority: _authority,
                redirectUri: _redirectUri);
        await pca.logout();
        return "Account removed";
      } else {
        return "No account found";
      }
    } on MsalException {
      return "Error signing out";
    } on PlatformException catch (e) {
      return "Some other exception ${e.toString()}";
    }
  }

  static Future<String?> acquireTokenSilently(List<String> scopes) async {
    try {
      AzureAdAuthentication pca =
          await AzureAdAuthentication.createPublicClientApplication(
        clientId: _clientId,
        authority: _authority,
      );

      UserAdModel? userAdModel = await pca.acquireTokenSilent(scopes: scopes);
      String? token = userAdModel?.accessToken;
      return token;
    } catch (e) {
      throw Exception('Error acquiring token silently: $e');
    }
  }

  static Future<bool> isTokenValid(String token) async {
    try {
      // Decodificar el token JWT
      final parts = token.split('.');
      if (parts.length != 3) {
        return false;
      }

      final payload = parts[1];
      final String decodedPayload =
          utf8.decode(base64Url.decode(base64Url.normalize(payload)));

      // Analizar el payload JSON
      final Map<String, dynamic> payloadMap = json.decode(decodedPayload);

      // Obtener la fecha de expiración del token
      final int exp = payloadMap['exp'];
      final DateTime expiryDate =
          DateTime.fromMillisecondsSinceEpoch(exp * 1000);

      // Verificar si el token ha expirado
      return expiryDate.isAfter(DateTime.now());
    } catch (e) {
      // Manejar cualquier error de decodificación
      return false;
    }
  }
}
