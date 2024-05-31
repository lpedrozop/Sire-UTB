import 'package:intl/intl.dart';

String parseDateTime(dynamic dateTimeOrReserva) {
  try {
    DateTime dateTime;
    if (dateTimeOrReserva is DateTime) {
      dateTime = dateTimeOrReserva;
    } else {
      dateTime = DateTime.parse(dateTimeOrReserva);
    }

    if (dateTime.toIso8601String().endsWith("000Z")) {
      final meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ];

      final mesIndex = dateTime.month - 1;
      final diaMes = dateTime.day;

      final horaFormatter = DateFormat.jm();
      final horaString = horaFormatter.format(dateTime);

      return "$diaMes de ${meses[mesIndex]} - $horaString";
    } else {
      return dateTime.toIso8601String();
    }
  } catch (e) {
    return "Invalid date format";
  }
}

String extractTextAfterED(String input) {
  int index = input.indexOf("ED");
  if (index == -1) {
    index = input.indexOf("EDMB");
    if (index != -1) {
      return input.substring(index + 4);
    }
  } else {
    return input.substring(index + 2);
  }
  return "";
}

String utilParseTime(dynamic dateTimeOrReserva) {
  try {
    DateTime dateTime;
    if (dateTimeOrReserva is DateTime) {
      dateTime = dateTimeOrReserva;
    } else {
      dateTime = DateTime.parse(dateTimeOrReserva);
    }

    final meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];

    final mesIndex = dateTime.month - 1;
    final diaMes = dateTime.day;

    final horaFormatter = DateFormat.jm();
    final horaString = horaFormatter.format(dateTime);

    return "$diaMes de ${meses[mesIndex]} - $horaString";
  } catch (e) {
    return "Invalid date format";
  }
}
