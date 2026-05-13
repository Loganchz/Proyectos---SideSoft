import json
from pathlib import Path

import requests
from flask import Flask, render_template, request

app = Flask(__name__)

STOCK_URL = (
    "http://estandar.sidesoftcorp.com/estandar/"
    "org.openbravo.service.json.jsonrest/MaterialMgmtStorageDetail"
)
DEFAULT_PARAMS = {"_startRow": 0, "_endRow": 200}
USE_LOCAL_TEST_DATA = False
LOCAL_TEST_FILE = Path(__file__).with_name("test.json")


def get_rows_from_response(payload):
    """Extrae la lista de registros desde diferentes formatos de respuesta JSON."""
    if isinstance(payload, dict):
        if isinstance(payload.get("response"), dict):
            data = payload["response"].get("data")
            if isinstance(data, list):
                return data
        if isinstance(payload.get("data"), list):
            return payload["data"]
    return []


def parse_quantity(value):
    """Convierte una cantidad a float; si falla, retorna 0.0."""
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def create_empty_product_summary():
    """Crea la estructura base para acumular stock por producto."""
    return {"product_id": "", "product_name": "", "unit": "", "quantity": 0.0}


def quantity_key(item):
    """Devuelve la cantidad para usarla como clave de ordenamiento."""
    return item["quantity"]


def summarize_rows(rows):
    """Calcula metricas y listas requeridas a partir de los registros del endpoint."""
    total_records = len(rows)
    total_products = len({row.get("product") for row in rows if row.get("product")})

    grouped = {}

    unit_not_unidad = []
    for row in rows:
        product_id = row.get("product") or ""
        product_name = row.get("product$_identifier") or ""
        unit = row.get("uOM$_identifier") or ""
        quantity = parse_quantity(row.get("quantityOnHand"))

        if product_id:
            if product_id not in grouped:
                grouped[product_id] = create_empty_product_summary()
            grouped[product_id]["product_id"] = product_id
            grouped[product_id]["product_name"] = product_name
            grouped[product_id]["unit"] = unit
            grouped[product_id]["quantity"] += quantity

        # if unit != "UNIDAD":
        if unit.upper() != "UNIDAD": #diferenciar mayuscula o minuscula
            unit_not_unidad.append(
                {
                    "product_id": product_id,
                    "product_name": product_name,
                    "unit": unit,
                    "quantity": quantity,
                }
            )

    top_products = sorted(grouped.values(), key=quantity_key, reverse=True)[:10]
    unique_products = list(grouped.values())

    return {
        "total_records": total_records,
        "total_products": total_products,
        "unit_not_unidad": unit_not_unidad,
        "top_products": top_products,
        "unique_products": unique_products,
    }


def load_rows_from_local_test_file():
    """Carga registros desde test.json para pruebas locales."""
    with LOCAL_TEST_FILE.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    return get_rows_from_response(payload)


@app.route("/", methods=["GET", "POST"])
def index():
    """Renderiza formulario y procesa la consulta del stock al enviar credenciales."""
    result = None
    error = None
    username = ""
    password = ""

    if request.method == "POST":
        if USE_LOCAL_TEST_DATA:
            try:
                rows = load_rows_from_local_test_file()
                result = summarize_rows(rows)
            except FileNotFoundError:
                error = f"No se encontro el archivo de prueba: {LOCAL_TEST_FILE.name}"
            except ValueError:
                error = "El archivo de prueba no tiene un formato JSON valido."
            return render_template(
                "index.html",
                result=result,
                error=error,
                username=username,
                password=password,
            )

        username = (request.form.get("username") or "").strip()
        password = (request.form.get("password") or "").strip()

        if not username or not password:
            error = "Debes ingresar username y password."
        else:
            try:
                response = requests.get(
                    STOCK_URL,
                    params=DEFAULT_PARAMS,
                    auth=(username, password),
                    timeout=20,
                )

                if response.status_code == 401:
                    error = "Credenciales invalidas. Verifica username y password."
                elif response.status_code >= 400:
                    error = f"El servicio respondio con error ({response.status_code})."
                else:
                    rows = get_rows_from_response(response.json())
                    result = summarize_rows(rows)
            except requests.RequestException:
                error = "No se pudo conectar al servicio. Intenta de nuevo."
            except ValueError:
                error = "La respuesta del servicio no tiene un formato valido."

    return render_template(
        "index.html",
        result=result,
        error=error,
        username=username,
        password=password,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
