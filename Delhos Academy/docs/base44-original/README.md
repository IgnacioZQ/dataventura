# Respaldo de la configuración de Base44

Delhos Academy se construyó en Base44, que ya no se usa. Esta carpeta guarda, solo como referencia, lo que
definía su backend allá:

- `entities/`: el esquema de cada tipo de dato (cursos, estudiantes, lecciones, tareas...). Es la mejor guía de
  qué campos tiene cada registro, por ejemplo para completar `src/data/datos-iniciales.json`.
- `functions/`: las funciones que corrían en el servidor. Las que usa el sitio están reimplementadas en
  `src/api/client.js`; las de Google Calendar y los avisos automáticos por correo necesitan un servidor propio.

Nada de esto se carga en el sitio.
