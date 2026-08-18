ORGANIGRAMA UIS — PROYECTO COMPLETO V10 FIX
================================================

ESTA CARPETA SÍ ES AUTÓNOMA.
Debe conservar exactamente esta estructura:

/
├── index.html
├── styles.css
├── script.js
├── .nojekyll
└── assets/
    └── uis-marca.png

CORRECCIÓN PRINCIPAL
--------------------
La versión anterior tenía un error de sintaxis en script.js:
se declaraba dos veces "const regencia" dentro de la misma función.
Eso detenía TODO JavaScript y por eso se veía el encabezado, pero
el lienzo del organigrama quedaba completamente vacío.

Esta versión:
- corrige el error de JavaScript;
- incluye index.html;
- incluye styles.css;
- incluye script.js;
- incluye el logo UIS completo en assets/uis-marca.png;
- mantiene zoom, edición, movimiento jerárquico en grupo y líneas editables;
- mantiene todas las adiciones realizadas hasta V10.

PARA GITHUB PAGES
-----------------
1. Reemplaza los archivos del repositorio por los de ESTA carpeta.
2. No subas solamente script.js.
3. La carpeta assets debe quedar en la raíz, junto a index.html.
4. Verifica que el repositorio tenga:
   assets/uis-marca.png
5. Después de subir los cambios, recarga con Ctrl + F5.

Si el navegador conserva una versión anterior en caché, Ctrl + F5
fuerza la recarga de index.html, styles.css y script.js.
