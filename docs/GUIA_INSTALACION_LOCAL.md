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
2. Abrí `.env` con el Bloc de notas y completá los datos de la base MySQL.
   - **Nota:** para la prueba local de la Fase 2, si todavía no tenés un MySQL en tu PC, no pasa nada: el servidor va a arrancar igual y la tarjeta "Base de datos" de la página va a mostrar error de conexión — eso es esperado. La conexión real se prueba en Hostinger, donde la base ya existe.

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

Abrí el navegador en **http://localhost:3000**. Deberías ver la página de prueba con dos tarjetas:
- **Servidor Node:** ✅ verde siempre (si arrancó).
- **Base de datos MySQL:** ✅ verde solo si configuraste un MySQL con las tablas; en tu PC sin MySQL va a dar ❌, y está bien por ahora.

Para **detener** el servidor: en el cmd, apretá `Ctrl + C`.

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
