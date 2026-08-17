ORGANIGRAMA UIS — EDITOR INTERACTIVO V2
=======================================

Esta versión mantiene el organigrama dentro del mismo lienzo: las dependencias se despliegan en su posición jerárquica y las líneas permanecen conectadas.

ARCHIVOS
- index.html
- styles.css
- script.js
- assets/uis-marca.png

CÓMO PROBARLO
1. Descomprime la carpeta.
2. Abre index.html en Chrome o Edge.
3. Haz clic en Rectoría, las Vicerrectorías o Facultades para desplegar/contraer su información.

EDICIÓN
1. Haz clic en “Editar organigrama”.
2. Arrastra cualquier casilla visible para moverla libremente dentro del organigrama.
3. Al mover una casilla, las líneas jerárquicas se redibujan automáticamente.
4. Selecciona una casilla para habilitar:
   - Renombrar.
   - Cambiar dependencia.
   - Eliminar.
5. “Agregar casilla” crea una nueva casilla y permite escoger de cuál dependencia cuelga.
6. También puedes usar las flechas del teclado para mover una casilla seleccionada (Shift + flecha = movimiento mayor).

GUARDADO
Los movimientos, nuevas casillas y cambios se guardan en localStorage del navegador.
“Restablecer” devuelve la estructura inicial.

TECNOLOGÍA
HTML + CSS + JavaScript puro. No requiere librerías externas ni servidor.
