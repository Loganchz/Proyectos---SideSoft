# Proyecto basico de stock en Python

Consultar stock desde un endpoint con Basic Auth y mostrar resultados en HTML.

## Requisitos
- Python 3.10 o superior

## Instalacion
En PowerShell:

```bash
python -m pip install -r requirements.txt

```

## Ejecucion
```bash
python app.py
```

Luego abre en navegador:
`http://127.0.0.1:5000`

## Credenciales
- Username: `Openbravo`
- Password: `1234`

## Lo que muestra
- Cantidad total de registros.
- Cantidad total de productos distintos.
- Tabla de productos con unidad diferente de UNIDAD -> (se diferencia entre mayúsculas y minúsculas).
- Top 10 productos con mayor stock.
