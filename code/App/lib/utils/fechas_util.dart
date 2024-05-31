String getDay(DateTime fecha) {
  int diaDeSemana = fecha.weekday;
  List<String> nombreDias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  int numeroDia = fecha.day;

  return '$numeroDia ${nombreDias[diaDeSemana - 1]}';
}

String getMonth(DateTime fecha) {
  int mes = fecha.month;
  List<String> nombreMeses = [
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

  return nombreMeses[mes - 1];
}
