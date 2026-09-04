# Guía: subir el proyecto a GitHub y desplegarlo en Hostinger

Circuito completo: **tu PC → GitHub → Hostinger (Web App Node.js)**.
Los pasos A y B se hacen **una sola vez**; el paso C es el que vas a repetir cada vez que haya una actualización.

> ⚠️ Los nombres exactos de botones y menús de Hostinger pueden variar un poco según versiones del panel. Si algo no coincide con lo que ves, anotá qué ves y consultale a Claude.

---

## A. Preparar GitHub (una sola vez)

1. Creá una cuenta gratuita en https://github.com (si no tenés).
2. Arriba a la derecha → **+** → **New repository**.
3. Nombre: `frutos-secos-carmen-t`. Elegí **Private** (código privado). No marques ninguna opción de inicialización (sin README, sin .gitignore — ya los tenemos). → **Create repository**.
4. Subir el código sin usar terminal:
   - En la página del repositorio recién creado, buscá el enlace **"uploading an existing file"**.
   - Arrastrá TODO el contenido de la carpeta del proyecto **excepto** `node_modules` y `.env` (si existieran — de todas formas `.gitignore` los protege cuando se usa git, pero al subir a mano hay que excluirlos uno mismo).
   - Abajo, botón verde **Commit changes**.
5. Verificá que en el repositorio se vean: `README.md`, `package.json`, `src/`, `public/`, `docs/`, `.env.example`, `.gitignore`.

> 🔒 **Regla de oro:** el archivo `.env` (con contraseñas) JAMÁS se sube a GitHub. Las credenciales en producción se cargan en el panel de Hostinger (paso B.4).

## B. Crear la Web App en Hostinger (una sola vez)

1. Entrá a **hpanel.hostinger.com**.
2. Buscá la sección de **Web Apps / Aplicaciones Node.js** (según la versión del panel puede estar en el menú principal o dentro de tu plan de hosting → "Administrar").
3. Creá una app nueva:
   - **Fuente:** conectar con GitHub → autorizá a Hostinger a acceder a tu cuenta → elegí el repositorio `frutos-secos-carmen-t`, rama `main`.
   - **Framework/tipo:** Node.js (suele detectarlo solo por el `package.json`).
   - **Comando de inicio:** `npm start` (si lo pide).
   - **Dominio:** elegí dónde vivirá la app (tu dominio o un subdominio tipo `crm.tudominio.com`).
4. **Variables de entorno** (equivalente al `.env` local): en la configuración de la Web App buscá "Environment variables" y cargá una por una:
   | Variable | Valor |
   |---|---|
   | DB_HOST | `localhost` (o el que indique Hostinger para MySQL) |
   | DB_PORT | `3306` |
   | DB_NAME | el nombre completo de tu base (con prefijo `u...._`) |
   | DB_USER | el usuario completo (con prefijo) |
   | DB_PASSWORD | tu contraseña de la base |
   | NODE_ENV | `produccion` |
5. Guardá y lanzá el **Deploy**.
6. **Verificación:** abrí la URL de la app. Deberías ver la página de prueba con las DOS tarjetas en verde ✅✅ (servidor + base de datos). Si la de base de datos da ❌, el detalle del error indica el problema (casi siempre credenciales mal cargadas en el paso 4).

## C. Subir una actualización (el flujo de siempre)

Cada vez que Claude te entregue código nuevo o hagas un arreglo a mano:

1. **Probalo primero en tu PC** (`npm start` → http://localhost:3000).
2. Entrá a tu repositorio en github.com.
3. **Add file → Upload files** → arrastrá los archivos modificados (se reemplazan solos al tener el mismo nombre y ruta — respetá las carpetas: si el archivo va en `src/`, subilo dentro de `src/`).
4. **Commit changes** con un mensajito de qué cambió (ej: "arreglo en comparador").
5. Hostinger detecta el cambio y **redespliega automáticamente** (puede tardar 1-3 minutos). Si tu panel no tiene auto-deploy activado, entrá a la Web App y tocá el botón de **Redeploy**.
6. Abrí la app y verificá que el cambio esté.

## Si algo sale mal después de un deploy

- La Web App en hPanel tiene una sección de **Logs**: ahí aparece el error real. Copialo tal cual y consultale a Claude.
- Peor escenario: en GitHub podés volver a subir la versión anterior de un archivo (cada archivo tiene su historial: entrá al archivo → History) y redeployar. Nada se pierde nunca — esa es la gracia de GitHub.
