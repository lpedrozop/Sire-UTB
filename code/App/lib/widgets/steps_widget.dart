import 'package:easy_stepper/easy_stepper.dart';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/evento_model.dart';
import 'package:uloginazure/utils/colores_util.dart';

class Steps extends StatefulWidget {
  final Evento evento;

  const Steps(this.evento, {super.key});

  @override
  State<Steps> createState() => _StepsState();
}

class _StepsState extends State<Steps> {
  int activeStep = 0;
  StepperType stepperType = StepperType.vertical;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(5.0),
        boxShadow: [
          BoxShadow(
            color: colorGris.withOpacity(0.3),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
        color: colorBlanco,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 30.0,
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(5.0),
                topRight: Radius.circular(5.0),
              ),
              color: primaryColor,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "${widget.evento.aula} por ${widget.evento.nombrePersona}",
                  style: const TextStyle(
                    color: colorBlanco,
                    fontSize: 14.0,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10.0),
          EasyStepper(
            activeStep: activeStep,
            activeStepTextColor: colorLetras,
            finishedStepTextColor: colorLetras,
            finishedStepBackgroundColor: colorVerde,
            internalPadding: 35,
            showLoadingAnimation: false,
            stepRadius: 8,
            showStepBorder: false,
            steps: [
              EasyStep(
                customStep: CircleAvatar(
                  radius: 8,
                  backgroundColor: grisTonoOscuro,
                  child: CircleAvatar(
                    radius: 7,
                    backgroundColor:
                        activeStep >= 0 ? colorAmarillo : grisTonoOscuro,
                  ),
                ),
                title: 'Enviada',
              ),
              EasyStep(
                customStep: CircleAvatar(
                  radius: 8,
                  backgroundColor: grisTonoOscuro,
                  child: CircleAvatar(
                    radius: 7,
                    backgroundColor:
                        activeStep >= 1 ? primaryColor : grisTonoOscuro,
                  ),
                ),
                title: 'Aprobacion',
              ),
              EasyStep(
                customStep: CircleAvatar(
                  radius: 8,
                  backgroundColor: grisTonoOscuro,
                  child: CircleAvatar(
                    radius: 7,
                    backgroundColor:
                        activeStep >= 4 ? colorVerde : grisTonoOscuro,
                  ),
                ),
                title: 'Aceptada',
              ),
            ],
            onStepReached: (index) => setState(() => activeStep = index),
          ),
        ],
      ),
    );
  }
}
