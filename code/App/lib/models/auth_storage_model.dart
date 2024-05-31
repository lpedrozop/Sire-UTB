import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class AuthStorage {
  static const String _tokenKeyPrefix = 'accessToken_';
  static const String _userProfileKey = 'userProfile';

  static Future<void> saveToken(String token, String tokenName) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKeyPrefix + tokenName, token);
  }

  static Future<void> deleteToken(String tokenName) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKeyPrefix + tokenName);
  }

  static Future<String?> getToken(String tokenName) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKeyPrefix + tokenName);
  }

  static Future<void> saveUserProfile(Map<String, dynamic> userProfile) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userProfileKey, json.encode(userProfile));
  }

  static Future<Map<String, dynamic>?> getUserProfile() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userProfileString = prefs.getString(_userProfileKey);
    if (userProfileString != null) {
      return json.decode(userProfileString);
    } else {
      return null;
    }
  }

  static Future<void> deleteUserProfile() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userProfileKey);
  }

}
