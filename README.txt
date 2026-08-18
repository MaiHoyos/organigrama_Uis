ORGANIGRAMA UIS — PROYECTO COMPLETO V18

CORRECCIÓN PARA GITHUB PAGES
============================
La exportación ya NO depende de html2canvas ni de un CDN externo.

El botón "Guardar PNG":
- convierte internamente el organigrama a SVG y luego a PNG;
- en Chrome/Edge sobre HTTPS abre el diálogo nativo "Guardar como...";
- en otros navegadores usa una descarga mediante Blob;
- exporta al doble de resolución;
- elimina de la imagen los controles +/− y los resaltados de edición.

Esto evita que la descarga dependa del atributo <a download> después de
un proceso asíncrono o de una librería externa.

Sube el proyecto COMPLETO V18 a GitHub Pages y haz Ctrl + F5.
