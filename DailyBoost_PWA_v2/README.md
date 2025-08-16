# DailyBoost (PWA)

App web lista para lanzar: mensajes motivacionales diarios + registro de estado de ánimo + paywall PRO.

## Requisitos
- Node 18+ y npm

## Instalar
```bash
npm install
```

## Ejecutar en local
```bash
npm run dev
```

Visita el URL que imprima Vite (normalmente http://localhost:5173).

## Build de producción
```bash
npm run build
npm run preview
```

## Instalar como PWA
Abre en tu móvil/desktop y usa "Añadir a pantalla de inicio". Se cachea offline con `sw.js`.

## Activar PRO (demo)
En local, abre **/pro** y pulsa "Activar PRO (demo)". Esto marca `isPro=true` en localStorage.

## Stripe (opcional)
Para pagos reales reemplaza `testCheckout` por tu enlace de Stripe Checkout (producto de suscripción) en `src/ui/Paywall.jsx`.

## Personalizar mensajes
Edita `src/messages.js` y añade nuevas categorías o frases.

---

© 2025 Tu Marca


## Novedades v2
- Ajustes (idioma, tema, recordatorio diario con notificaciones del navegador).
- Racha, objetivo semanal y coach de micro-acciones.
- Exportar/Importar datos en JSON.
- Contenido PRO ampliado.
