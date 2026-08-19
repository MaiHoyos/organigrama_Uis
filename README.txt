ORGANIGRAMA UIS — PROYECTO COMPLETO V24

CAMBIOS V24
===========

1. FACULTADES
- Toda la rama de Facultades se mueve 60 px adicionales hacia la derecha.

2. EXPORTACIÓN PNG SIN RECORTE
- El sistema de guardado PNG ya no usa un ancho/alto fijo para el recorte.
- Ahora calcula automáticamente los límites reales del contenido visible:
  - casillas;
  - líneas;
  - recuadros informativos.
- Luego exporta únicamente el área necesaria, con márgenes de seguridad.
- Esto evita que el PNG salga cortado cuando el organigrama crece en altura
  o cuando alguna rama queda más a la derecha.

3. EL PNG INCLUYE COMPLETO EL CONTENIDO VISIBLE
- Si una rama está desplegada, se exporta completa.
- Si una rama está contraída, se exporta en el estado actual visible.
- La imagen se genera con padding alrededor para que no quede pegada al borde.

SE CONSERVA
===========
- edición siempre activa;
- autoajuste vertical al desplegar/contraer;
- UIAES oculto hasta abrir Planeación manualmente;
- exportación PNG mediante canvas;
- zoom;
- líneas editables;
- guardado automático;
- todos los cambios institucionales de V23.

Para GitHub Pages:
sube el proyecto completo V24 y luego haz Ctrl + F5.
