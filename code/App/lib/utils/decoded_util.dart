import 'dart:convert';

Map<String, dynamic> decodeJwt(String token) {
  final parts = token.split('.');
  if (parts.length != 3) {
    throw const FormatException('Invalid token.');
  }
  final payload = parts[1];
  final String normalized = base64Url.normalize(payload);
  final String decoded = utf8.decode(base64Url.decode(normalized));
  final Map<String, dynamic> jsonMap = json.decode(decoded);
  return jsonMap;
}
