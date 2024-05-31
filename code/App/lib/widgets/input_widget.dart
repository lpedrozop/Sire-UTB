import 'package:flutter/material.dart';
import 'package:uloginazure/utils/colores_util.dart';

class InputLabel extends StatelessWidget {
  final String contenidoCampo;
  final String label;

  const InputLabel({
    super.key,
    required this.contenidoCampo,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          overflow: TextOverflow.ellipsis,
          style:
              const TextStyle(fontWeight: FontWeight.bold, color: colorLetras),
        ),
        const SizedBox(height: 7.0),
        TextField(
          readOnly: true,
          decoration: InputDecoration(
            enabledBorder: UnderlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
              borderRadius: BorderRadius.circular(10.0),
            ),
            contentPadding:
                const EdgeInsets.symmetric(vertical: 10.0, horizontal: 12.0),
            hintText: contenidoCampo,
            filled: true,
            fillColor: colorBlanco,
            hintStyle: const TextStyle(
                color: colorLetras,
                fontWeight: FontWeight.normal,
                fontSize: 15.0),
          ),
        ),
        const SizedBox(height: 15.0),
      ],
    );
  }
}
