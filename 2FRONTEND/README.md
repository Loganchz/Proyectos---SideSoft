# Crypto Table Frontend

Proyecto organizado en dos capas:

- `frontend/`: interfaz HTML, CSS y JavaScript.
- `backend/`: proxy en Python (Flask) para consumir CoinMarketCap sin exponer la API Key.

## Estructura

- `frontend/index.html`
- `frontend/styles.css`
- `frontend/app.js`
- `backend/app.py`
- `backend/requirements.txt`
- `.env` (local, no versionado)
- `.env.example` (plantilla)

## Ejecucion

1. Instalar dependencias:

   `python -m pip install -r backend/requirements.txt`

2. Configurar variables:

   - Copiar `.env.example` a `.env`
   - Definir `CMC_API_KEY`

3. Levantar servidor:

   `python backend/app.py`

4. Abrir en navegador:

   `http://127.0.0.1:3000`
