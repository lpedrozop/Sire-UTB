import 'dart:convert';
import 'dart:developer';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:uloginazure/utils/helpers.dart';
import 'auth_storage_model.dart';

class ApiService {
  static Future<Map<String, dynamic>> fetchUserProfile(
      BuildContext context) async {
    try {
      String token = await ApiServiceHelper.getValidToken(
          'GraphToken',
          ['api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso'],
          context);

      final response = await http.get(
        Uri.parse('https://sire-utb-x2ifq.ondigitalocean.app/form/materia'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        Map<String, dynamic> userProfile = json.decode(response.body);
        await AuthStorage.saveUserProfile(userProfile);
        return userProfile;
      } else {
        throw Exception('Failed to fetch user profile');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<List<T>> fetchTodoList<T>(
    BuildContext context, {
    required String url,
    required String method,
    Map<String, dynamic>? body,
    required T Function(Map<String, dynamic>) fromJson,
  }) async {
    try {
      String token = await ApiServiceHelper.getValidToken(
        "todoListToken",
        ['api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso'],
        context,
      );

      late http.Response response;
      if (method.toLowerCase() == 'post') {
        if (body == null) {
          throw ArgumentError('Body must not be null for POST method');
        }
        response = await http.post(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          },
          body: json.encode(body),
        );
      } else if (method.toLowerCase() == 'patch') {
        if (body == null) {
          throw ArgumentError('Body must not be null for PATCH method');
        }
        response = await http.patch(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          },
          body: json.encode(body),
        );
      } else {
        response = await http.get(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );
      }

      if (response.statusCode == 200) {
        List<dynamic> jsonList = json.decode(response.body);
        log(response.body);
        List<T> items = [];
        for (var json in jsonList) {
          items.add(fromJson(json));
        }
        return items;
      } else {
        throw Exception('Failed to fetch data');
      }
    } catch (e) {
      log('Error: $e');
      throw Exception('Error: $e');
    }
  }

  static Future<T> fetchPatch<T>(
    BuildContext context, {
    required String url,
    required String method,
    Map<String, dynamic>? body,
    required T Function(dynamic) fromJson,
  }) async {
    try {
      String token = await ApiServiceHelper.getValidToken(
        "todoListToken",
        ['api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso'],
        context,
      );

      late http.Response response;
      if (method.toLowerCase() == 'patch') {
        if (body == null) {
          throw ArgumentError('Body must not be null for PATCH method');
        }
        response = await http.patch(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          },
          body: json.encode(body),
        );
      } else if (method.toLowerCase() == 'post') {
        if (body == null) {
          throw ArgumentError('Body must not be null for POST method');
        }
        response = await http.post(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          },
          body: json.encode(body),
        );
      } else {
        response = await http.get(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );
      }

      if (response.statusCode == 200) {
        dynamic jsonResponse = json.decode(response.body);
        if (jsonResponse is List) {
          List<T> items = [];
          for (var jsonItem in jsonResponse) {
            items.add(fromJson(jsonItem));
          }
          return items as T;
        } else {
          return fromJson(jsonResponse);
        }
      } else {
        throw Exception('Failed to fetch data');
      }
    } catch (e) {
      log('Error: $e');
      throw Exception('Error: $e');
    }
  }

  static Future<T> fetchSingleItem<T>(
    BuildContext context, {
    required String url,
    required String method,
    Map<String, dynamic>? body,
    required T Function(dynamic) fromJson,
  }) async {
    try {
      String token = await ApiServiceHelper.getValidToken(
        "todoListToken",
        ['api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso'],
        context,
      );

      late http.Response response;
      if (method.toLowerCase() == 'post') {
        if (body == null) {
          throw ArgumentError('Body must not be null for POST method');
        }
        response = await http.post(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          },
          body: json.encode(body),
        );
      } else {
        response = await http.get(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );
      }

      if (response.statusCode == 200) {
        dynamic jsonData = json.decode(response.body);

        // Si T es List, esperamos una lista de objetos
        if (T == List) {
          List<dynamic> jsonList = jsonData as List<dynamic>;
          List<T> items = jsonList.map((item) => fromJson(item)).toList();
          return items as T;
        } else {
          // Si T no es List, esperamos un solo objeto
          T item = fromJson(jsonData);
          return item;
        }
      } else {
        throw Exception('Failed to fetch data');
      }
    } catch (e) {
      log('Error: $e');
      throw Exception('Error: $e');
    }
  }

  static Future<T> fetchPatchAdmin<T>(
    BuildContext context, {
    required String url,
    required String method,
    Map<String, dynamic>? body,
    required T Function(dynamic) fromJson,
  }) async {
    try {
      String token = await ApiServiceHelper.getValidToken(
        "todoListToken",
        ['api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso'],
        context,
      );

      late http.Response response;
      if (method.toLowerCase() == 'patch') {
        if (body == null) {
          throw ArgumentError('Body must not be null for PATCH method');
        }
        response = await http.patch(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          },
          body: json.encode(body),
        );
      } else if (method.toLowerCase() == 'post') {
        if (body == null) {
          throw ArgumentError('Body must not be null for POST method');
        }
        response = await http.post(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          },
          body: json.encode(body),
        );
      } else {
        response = await http.get(
          Uri.parse(url),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );
      }

      if (response.statusCode == 200) {
        dynamic jsonResponse = json.decode(response.body);
        if (jsonResponse is List) {
          List<T> items = [];
          for (var jsonItem in jsonResponse) {
            items.add(fromJson(jsonItem));
          }
          return items as T;
        } else {
          return fromJson(jsonResponse);
        }
      } else {
        throw Exception('Failed to fetch data');
      }
    } catch (e) {
      log('Error: $e');
      throw Exception('Error: $e');
    }
  }

  static Future<T> fetchDelete<T>(
    BuildContext context, {
    required String url,
    required String method,
    Map<String, dynamic>? body,
    required T Function(dynamic) fromJson,
  }) async {
    try {
      String token = await ApiServiceHelper.getValidToken(
        "todoListToken",
        ['api://f928ab89-bd59-4400-8477-829e0cf9cc59/reservas.acceso'],
        context,
      );

      late http.Response response;
      final headers = {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      };

      if (method.toLowerCase() == 'patch') {
        if (body == null) {
          throw ArgumentError('Body must not be null for PATCH method');
        }
        response = await http.patch(
          Uri.parse(url),
          headers: headers,
          body: json.encode(body),
        );
      } else if (method.toLowerCase() == 'post') {
        if (body == null) {
          throw ArgumentError('Body must not be null for POST method');
        }
        response = await http.post(
          Uri.parse(url),
          headers: headers,
          body: json.encode(body),
        );
      } else if (method.toLowerCase() == 'delete') {
        response = await http.delete(
          Uri.parse(url),
          headers: headers,
        );
      } else {
        response = await http.get(
          Uri.parse(url),
          headers: headers,
        );
      }

      if (response.statusCode == 200) {
        dynamic jsonResponse = json.decode(response.body);
        if (jsonResponse is List) {
          List<T> items = [];
          for (var jsonItem in jsonResponse) {
            items.add(fromJson(jsonItem));
          }
          return items as T;
        } else {
          return fromJson(jsonResponse);
        }
      } else {
        throw Exception('Failed to fetch data');
      }
    } catch (e) {
      log('Error: $e');
      throw Exception('Error: $e');
    }
  }
}
