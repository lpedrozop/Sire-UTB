import 'package:easy_stepper/easy_stepper.dart';
import 'package:flutter/material.dart';
import 'package:uloginazure/models/profesor_model.dart';
import 'package:uloginazure/utils/colores_util.dart';
import 'package:uloginazure/utils/fecha_util.dart';

class StepEst extends StatefulWidget {
  final Aforo aforo;

  const StepEst(this.aforo, {super.key});

  @override
  State<StepEst> createState() => _StepEst();
}

class _StepEst extends State<StepEst> {
  int activeStep = 0;
  StepperType stepperType = StepperType.vertical;

  @override
  Widget build(BuildContext context) {
    late Color estadoColor;
    late Color aprDoc = colorRojo;

    if (widget.aforo.estado.isNotEmpty) {
      activeStep = 1;
    }

    if (widget.aforo.estado == "Pendiente") {
      estadoColor = colorAmarillo;
    } else if (widget.aforo.estado == "Rechazada") {
      estadoColor = colorRojo;
    } else if (widget.aforo.estado == "Cancelada") {
      estadoColor = colorRojo;
    } else if (widget.aforo.estado == "Aprobada") {
      estadoColor = colorVerde;
      activeStep = 2;
    }

    if (widget.aforo.aprDoc == "Pendiente") {
      aprDoc = colorAmarillo;
    } else if (widget.aforo.aprDoc == "Rechazada") {
      aprDoc = colorRojo;
    } else if (widget.aforo.aprDoc == "Aprobada") {
      activeStep = 2;
      aprDoc = colorVerde;
    }

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
                  "${parseDateTime(widget.aforo.fhIni)} - ${extractTextAfterED(widget.aforo.idEspacio)}",
                  style: const TextStyle(
                    color: colorBlanco,
                    fontSize: 13.0,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(height: 10.0),
          EasyStepper(
            activeStep: activeStep,
            activeStepTextColor: colorLetras,
            finishedStepTextColor: grisTonoOscuro,
            finishedStepBackgroundColor: colorVerde,
            internalPadding: 30,
            showLoadingAnimation: false,
            stepRadius: 8,
            showStepBorder: false,
            steps: [
              EasyStep(
                customStep: CircleAvatar(
                  radius: 8,
                  child: CircleAvatar(
                    radius: 7,
                    backgroundColor:
                        activeStep >= 0 ? colorVerde : grisTonoOscuro,
                  ),
                ),
                title: 'Enviada',
              ),
              EasyStep(
                customStep: CircleAvatar(
                  radius: 8,
                  child: CircleAvatar(
                    radius: 7,
                    backgroundColor: activeStep >= 1 ? aprDoc : grisTonoOscuro,
                  ),
                ),
                title: widget.aforo.aprDoc,
              ),
              EasyStep(
                customStep: CircleAvatar(
                  radius: 8,
                  child: CircleAvatar(
                    radius: 7,
                    backgroundColor:
                        activeStep >= 2 ? estadoColor : grisTonoOscuro,
                  ),
                ),
                title: widget.aforo.estado,
              ),
            ],
            onStepReached: (index) => setState(() => activeStep = index),
          ),
        ],
      ),
    );
  }
}
