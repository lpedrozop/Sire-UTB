import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/api_services_model.dart';
import 'package:uloginazure/models/auth_storage_model.dart';
import 'package:uloginazure/utils/decoded_util.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class UserProfileProvider with ChangeNotifier {
  static final UserProfileProvider _singleton = UserProfileProvider._internal();

  factory UserProfileProvider() {
    return _singleton;
  }

  UserProfileProvider._internal();

  static UserProfileProvider get instance => _singleton;

  Map<String, dynamic> _userData = {};
  Map<String, dynamic> _decodedToken = {};

  Map<String, dynamic> get userData => _userData;
  Map<String, dynamic> get decodedToken => _decodedToken;

  String? _userRole;

  String? get getUserRole => _userRole;
  Future<void> loadUserProfile(BuildContext context) async {
    try {
      if (_userData.isEmpty) {
        _userData = await ApiService.fetchUserProfile(context);
        String? token = await AuthStorage.getToken('GraphToken');
        if (token != null) {
          Map<String, dynamic> decodedToken = JwtDecoder.decode(token);
          _decodedToken = decodeJwt(token);
          List<dynamic> roles = decodedToken['roles'];
          if (roles.isNotEmpty) {
            _userRole = roles.first;
          }

          notifyListeners();
        }
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error fetching user profile: $e');
      }
    }
  }

  void clearUserProfile() {
    _userData.clear();
    notifyListeners();
  }
}
