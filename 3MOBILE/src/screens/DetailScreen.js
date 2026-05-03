import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

function formatCurrency(value) {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value, digits = 0) {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function DetailScreen({ route }) {
  const { crypto } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Row label="#" value={String(crypto.cmc_rank)} />
        <Row label="Nombre" value={`${crypto.symbol} - ${crypto.name}`} />
        <Row label="Precio" value={formatCurrency(crypto.quote?.USD?.price)} />
        <Row
          label="Capitalizacion"
          value={formatNumber(crypto.quote?.USD?.market_cap)}
        />
        <Row label="Suministro Maximo" value={formatNumber(crypto.max_supply)} />
        <Row
          label="Suministro Circulante"
          value={formatNumber(crypto.circulating_supply)}
        />
        <Row
          label="1D %"
          value={`${formatNumber(crypto.quote?.USD?.percent_change_24h, 2)} %`}
        />
        <Row
          label="30D %"
          value={`${formatNumber(crypto.quote?.USD?.percent_change_30d, 2)} %`}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e7eb',
    borderRadius: 10,
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    color: '#334155',
    fontWeight: '600',
  },
  value: {
    color: '#0f172a',
    maxWidth: '60%',
    textAlign: 'right',
  },
});
