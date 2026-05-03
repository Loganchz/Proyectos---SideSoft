# 3MOBILE — App de criptomonedas (Expo)

Aplicación móvil con **Expo** y **React Native** que muestra el top 100 de criptomonedas por capitalización y permite ver el detalle de cada una. Los datos provienen de la API de [CoinMarketCap](https://coinmarketcap.com/api/).

## Requisitos previos

- **Node.js** (LTS recomendado, por ejemplo 20.x o 22.x)
- **npm** (incluido con Node)
- Para probar en dispositivo físico: app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Para **Android** en emulador: Android Studio con un AVD configurado
- Para **iOS** en simulador: macOS con Xcode (solo en Mac)

## Instalación

En la raíz del proyecto:

```bash
npm install
```

## Configuración de la API (CoinMarketCap)

La lista de monedas usa la API Pro de CoinMarketCap. Debes tener una **API Key** válida.

En el código, la clave se define en `src/services/coinmarketcap.js` (header `X-CMC_PRO_API_KEY`). Sustituye el valor por tu propia clave si la tuya caduca o no tienes acceso a la actual.



## Levantar el proyecto

### Modo desarrollo (Metro + QR)

```bash
npm start
```

Se abre la interfaz de Expo. Puedes:

- Escanear el QR con **Expo Go** (misma red Wi‑Fi que el PC)
- Pulsar `a` para Android (emulador/dispositivo)
- Pulsar `i` para iOS (solo Mac, simulador)
- Pulsar `w` para versión web

### Atajos por plataforma

| Comando           | Descripción                    |
|-------------------|--------------------------------|
| `npm start`       | Servidor de desarrollo Expo    |
| `npm run android` | Inicia en Android              |
| `npm run web`     | Inicia en navegador            |

## Estructura relevante

- `App.js` — Navegación principal (stack: Home → Detail)
- `src/screens/` — Pantallas
- `src/components/` — Componentes reutilizables
- `src/services/coinmarketcap.js` — Cliente de la API


