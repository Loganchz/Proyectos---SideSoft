const API_URL =
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100&sort=market_cap&sort_dir=desc';

const API_KEY = '1276dec7-5445-4bc4-9029-a052f3c160ee';

export async function getTopCryptos() {
  const response = await fetch(API_URL, {
    headers: {
      Accept: 'application/json',
      'X-CMC_PRO_API_KEY': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener la lista de criptomonedas.');
  }

  const json = await response.json();
  return json?.data || [];
}
