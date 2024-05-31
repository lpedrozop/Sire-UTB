import 'package:flutter/material.dart';
import 'package:uloginazure/utils/colores_util.dart';

class ContactoPage extends StatelessWidget {
  const ContactoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: barColor,
      appBar: AppBar(
        backgroundColor: primaryColor,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.close),
          iconSize: 22.0,
          color: colorBlanco,
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(15.0),
          color: primaryColor,
          height: MediaQuery.of(context).size.height * 0.9,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.local_post_office,
                size: 130.0,
                color: colorBlanco,
              ),
              const Text(
                "Si tienes alguna peticion, queja  o reclamo por favor dejanos un mensaje aqui.",
                style: TextStyle(
                  color: colorBlanco,
                  fontSize: 13.0,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30.0),
              TextField(
                maxLines: null,
                decoration: InputDecoration(
                  enabledBorder: UnderlineInputBorder(
                    borderSide: const BorderSide(color: Colors.transparent),
                    borderRadius: BorderRadius.circular(5.0),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                      vertical: 50.0, horizontal: 25.0),
                  hintText: "Mensaje...",
                  filled: true,
                  fillColor: colorBlanco,
                  hintStyle: const TextStyle(
                      color: colorLetras,
                      fontWeight: FontWeight.normal,
                      fontSize: 15.0),
                ),
              ),
              const SizedBox(height: 60.0),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colorBlanco,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5.0),
                    ),
                  ),
                  onPressed: () {},
                  child: const Text(
                    "Enviar",
                    style: TextStyle(
                        color: primaryColor,
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
