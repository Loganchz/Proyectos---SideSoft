const tableBody = document.getElementById("cryptoTableBody");
const refreshBtn = document.getElementById("refreshBtn");
const statusEl = document.getElementById("status");
const headerCells = Array.from(document.querySelectorAll("th[data-sort-key]"));

let rows = [];
let sortState = { key: null, direction: "asc" };

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compactUsdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatPercentage(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return `${value.toFixed(2)}%`;
}

function formatSupply(value) {
  if (value === null || value === undefined) return "N/A";
  return numberFormatter.format(value);
}

function mapCoinToRow(coin) {
  const usd = coin?.quote?.USD || {};
  return {
    rank: coin.cmc_rank ?? null,
    name: `${coin.symbol} - ${coin.name}`,
    price: usd.price ?? null,
    marketCap: usd.market_cap ?? null,
    maxSupply: coin.max_supply ?? null,
    circulatingSupply: coin.circulating_supply ?? null,
    change1d: usd.percent_change_24h ?? null,
    change30d: usd.percent_change_30d ?? null,
  };
}

function compareValues(a, b, direction) {
  const multiplier = direction === "asc" ? 1 : -1;

  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b) * multiplier;
  }

  return (a - b) * multiplier;
}

function applySorting(data) {
  if (!sortState.key) return [...data];
  return [...data].sort((left, right) =>
    compareValues(left[sortState.key], right[sortState.key], sortState.direction),
  );
}

function updateHeaderIndicators() {
  headerCells.forEach((cell) => {
    const key = cell.dataset.sortKey;
    const label = cell.textContent.replace(" ▲", "").replace(" ▼", "");
    cell.textContent = label;
    cell.classList.remove("active");

    if (key === sortState.key) {
      cell.classList.add("active");
      cell.textContent = `${label} ${sortState.direction === "asc" ? "▲" : "▼"}`;
    }
  });
}

function renderTable() {
  const sortedRows = applySorting(rows);
  tableBody.innerHTML = "";

  sortedRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.rank ?? "N/A"}</td>
      <td>${row.name}</td>
      <td>${row.price === null ? "N/A" : usdFormatter.format(row.price)}</td>
      <td>${row.marketCap === null ? "N/A" : compactUsdFormatter.format(row.marketCap)}</td>
      <td>${formatSupply(row.maxSupply)}</td>
      <td>${formatSupply(row.circulatingSupply)}</td>
      <td class="${row.change1d >= 0 ? "positive" : "negative"}">${formatPercentage(row.change1d)}</td>
      <td class="${row.change30d >= 0 ? "positive" : "negative"}">${formatPercentage(row.change30d)}</td>
    `;
    tableBody.appendChild(tr);
  });

  updateHeaderIndicators();
}

async function loadData() {
  statusEl.textContent = "Cargando datos...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch("/api/cryptos");
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.error || "Error al consultar el backend.");
    }

    const payload = await response.json();
    rows = (payload.data || []).map(mapCoinToRow);
    renderTable();
    statusEl.textContent = `Lista actualizada (${rows.length} criptomonedas).`;
  } catch (error) {
    rows = [];
    renderTable();
    statusEl.textContent = `No se pudo cargar la información: ${error.message}`;
  } finally {
    refreshBtn.disabled = false;
  }
}

headerCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const key = cell.dataset.sortKey;
    if (sortState.key === key) {
      sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
    } else {
      sortState.key = key;
      sortState.direction = "asc";
    }
    renderTable();
  });
});

refreshBtn.addEventListener("click", loadData);

loadData();
