# Guía: subir el proyecto a GitHub y desplegarlo en Hostinger

Circuito completo: **tu PC → GitHub → Hostinger (Web App Node.js)**.
Los pasos A y B se hacen **una sola vez**; el paso C es el que vas a repetir cada vez que haya una actualización.

> ⚠️ Los nombres exactos de botones y menús de Hostinger pueden variar un poco según versiones del panel. Si algo no coincide con lo que ves, anotá qué ves y consultale a Claude.

---

## A. Preparar GitHub (una sola vez) — ✅ HECHO

Repositorio real: **<https://github.com/ajvsubotichinfo-eng/chiringuito>** (privado), rama `main`.
El código ya está subido (Claude lo hizo con `git push` en la sesión del 04/09/2026). No hace falta repetir este paso.

> 🔒 **Regla de oro:** el archivo `.env` (con contraseñas) JAMÁS se sube a GitHub. Está protegido por `.gitignore` y no está en el repositorio. Las credenciales en producción se cargan en el panel de Hostinger (paso B.4).

## B. Crear la Web App en Hostinger (una sola vez)

1. Entrá a **hpanel.hostinger.com**.
2. Buscá la sección de **Web Apps / Aplicaciones Node.js** (según la versión del panel puede estar en el menú principal o dentro de tu plan de hosting → "Administrar").
3. Creá una app nueva:
   - **Fuente:** conectar con GitHub → autorizá a Hostinger a acceder a tu cuenta → elegí el repositorio `ajvsubotichinfo-eng/chiringuito`, rama `main`.
   - **Framework/tipo:** Node.js (suele detectarlo solo por el `package.json`).
   - **Comando de inicio:** `npm start` (si lo pide).
   - **Dominio:** elegí dónde vivirá la app (tu dominio o un subdominio tipo `crm.tudominio.com`).
4. **Variables de entorno** (equivalente al `.env` local): en la configuración de la Web App buscá "Environment variables" y cargá una por una:
   | Variable | Valor |
   |---|---|
   | DB_HOST | `localhost` — **⚠️ no uses la IP externa del `.env` local.** La Web App corre en el mismo servidor que la base, así que se conecta por `localhost`; la IP externa es solo para conectarse desde afuera (tu PC). Usar la IP externa acá da `ER_ACCESS_DENIED_ERROR`. |
   | DB_PORT | `3306` |
   | DB_NAME | el mismo valor que en tu `.env` |
   | DB_USER | el mismo valor que en tu `.env` |
   | DB_PASSWORD | el mismo valor que en tu `.env` |
   | NODE_ENV | `produccion` |
5. Guardá y lanzá el **Deploy**.
6. **Verificación:** abrí la URL de la app. Deberías ver la pantalla de Login del CRM. Si en cambio ves un error de base de datos, el detalle indica el problema (casi siempre `DB_HOST` mal puesto o credenciales mal cargadas en el paso 4).

## C. Subir una actualización (el flujo de siempre)

Hostinger **no compila nada**: solo corre `npm start` con el código tal cual está en GitHub. Por eso, si el cambio toca el frontend (carpeta `frontend/`), hay que compilarlo ANTES de subir — el resultado ya compilado vive en `/public` y viaja dentro del repositorio.

Cada vez que Claude te entregue código nuevo (Claude hace el `git push` directamente, con tu confirmación) o hagas un arreglo a mano:

1. **Probalo primero en tu PC** (`npm start` → http://localhost:3000).
2. Si tocaste algo de `frontend/`: `npm run build:frontend` (recompila y actualiza `/public`) — esto hay que hacerlo SIEMPRE antes de subir un cambio de frontend, si no, Hostinger sigue mostrando la versión vieja.
3. Subir a GitHub — Claude lo hace con `git push`, o a mano: entrá a tu repositorio en <https://github.com/ajvsubotichinfo-eng/chiringuito> → **Add file → Upload files** → arrastrá los archivos modificados (respetá las carpetas) → **Commit changes**.
4. Hostinger detecta el cambio y **redespliega automáticamente** (puede tardar 1-3 minutos). Si tu panel no tiene auto-deploy activado, entrá a la Web App y tocá el botón de **Redeploy**.
5. Abrí la app y verificá que el cambio esté.

## Si algo sale mal después de un deploy

- La Web App en hPanel tiene una sección de **Logs**: ahí aparece el error real. Copialo tal cual y consultale a Claude.
- Peor escenario: en GitHub podés volver a subir la versión anterior de un archivo (cada archivo tiene su historial: entrá al archivo → History) y redeployar. Nada se pierde nunca — esa es la gracia de GitHub.
