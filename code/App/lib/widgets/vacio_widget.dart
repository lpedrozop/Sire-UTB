import 'package:flutter/material.dart';
import 'package:uloginazure/utils/colores_util.dart';

class VacioWidget extends StatelessWidget {
  const VacioWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        color: barColor,
        width: double.infinity,
        height: 130.0,
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(
              Icons.inbox,
              size: 48.0,
              color: colorGris,
            ),
            SizedBox(height: 16.0),
            Text(
              "No hay elementos",
              style: TextStyle(
                fontSize: 16.0,
                color: colorGris,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
