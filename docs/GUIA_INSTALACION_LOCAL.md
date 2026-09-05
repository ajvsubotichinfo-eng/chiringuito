# Guía: correr el proyecto en tu PC (Windows)

Esta guía es para la **primera vez**. Después de esto, arrancar el proyecto es un solo comando.

---

## Paso 1 — Instalar Node.js (solo una vez)

1. Entrá a https://nodejs.org
2. Descargá la versión **LTS** (el botón recomendado).
3. Instalala con todo por defecto (Siguiente, Siguiente, Finalizar).
4. Verificación: abrí el **Símbolo del sistema** (tecla Windows → escribir `cmd` → Enter) y escribí:
   ```
   node --version
   ```
   Debe mostrar algo como `v20.x.x`. Si dice "no se reconoce como comando", cerrá y volvé a abrir el cmd (o reiniciá la PC).

## Paso 2 — Ubicar el proyecto

El proyecto debe estar descomprimido en:
```
C:\programacion\enlaweb-tech\frutos-secos-carmen-t
```
(Si está en otro lado, ajustá las rutas de los comandos siguientes.)

## Paso 3 — Instalar las dependencias (solo una vez)

En el Símbolo del sistema:
```
cd C:\programacion\enlaweb-tech\frutos-secos-carmen-t
npm install
```
Esto descarga las librerías del proyecto en la carpeta `node_modules` (tarda 1-2 minutos la primera vez). Se repite solo si algún día cambia el archivo `package.json`.

## Paso 4 — Crear tu archivo de configuración

1. En la carpeta del proyecto, copiá el archivo `.env.example` y renombrá la copia como `.env` (así, con el punto adelante).
   - Si Windows no te deja renombrar, hacelo desde el cmd:
     ```
     copy .env.example .env
     ```
2. Abrí `.env` con el Bloc de notas y completá los datos de la base MySQL (los mismos que están cargados en producción, se los pedís a Claude o los mirás en hPanel) y una clave cualquiera larga en `JWT_SECRET`.

## Paso 5 — Arrancar el servidor

```
npm start
```
Vas a ver un mensaje como:
```
============================================
  CRM Frutos Secos Carmen T
  Servidor corriendo en el puerto 3000
  Abrir en el navegador: http://localhost:3000
============================================
```

## Paso 6 — Probar

Abrí el navegador en **http://localhost:3000**. Deberías ver la pantalla de Login del CRM. Iniciá sesión con tu usuario para entrar a la app.

Para **detener** el servidor: en el cmd, apretá `Ctrl + C`.

## (Opcional) Programar el frontend con recarga automática

Si vas a editar pantallas de React (`frontend/`), conviene correrlo aparte para ver los cambios al instante:
```
cd frontend
npm install
npm run dev
```
Se abre en otra dirección (ej. `http://localhost:5173`) y ya manda solo las llamadas a la API al backend (que tiene que estar corriendo con `npm start` en la otra terminal). Cuando termines de editar, **no te olvides de** `npm run build:frontend` (desde la carpeta principal del proyecto) antes de subir los cambios — si no, Hostinger va a seguir mostrando la versión vieja.

---

## Problemas frecuentes

| Síntoma | Solución |
|---|---|
| `'node' no se reconoce como comando` | Node no está instalado o hay que reabrir el cmd. Volver al Paso 1 |
| `'npm' no se reconoce` | Ídem anterior — npm viene con Node |
| `Error: Cannot find module 'express'` | Faltó el `npm install` (Paso 3) |
| `EADDRINUSE: address already in use` | Ya hay un servidor corriendo en el puerto 3000. Cerrá el otro cmd, o cambiá `PORT=3001` en `.env` |
| La página no carga | Verificá que el cmd siga abierto con el servidor corriendo |

Cualquier otro error: copialo tal cual y consultale a Claude.
